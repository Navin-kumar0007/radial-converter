#include "shift_drag.h"

#include <flutter/method_result_functions.h>
#include <flutter/standard_method_codec.h>
#include <shellapi.h>
#include <shlobj.h>
#include <shobjidl.h>
#include <windowsx.h>

#include <algorithm>
#include <cmath>
#include <cstdlib>
#include <utility>

#include "radial_slice.h"
#include "utils.h"

namespace {

using flutter::EncodableList;
using flutter::EncodableMap;
using flutter::EncodableValue;

const wchar_t kPanelClass[] = L"RADIAL_SHIFT_DRAG_PANEL";
const wchar_t kChipClass[] = L"RADIAL_RESULT_CHIP";
const UINT_PTR kChipTimer = 2;
// A chip left alone goes away by itself.
const UINT kChipLifetimeMs = 15000;
const int kChipWidth = 280;
const int kChipHeight = 56;
const UINT_PTR kTimer = 1;
const UINT kCheckEveryMs = 33;
// Past this many pixels a press has become a drag.
const int kDragDistance = 8;
// A drop on the menu arrives just after the button is released, so give it time.
const ULONGLONG kHideDelayMs = 400;
// Invisible, but still where a drag can find it.
const BYTE kAlphaHidden = 1;
const BYTE kAlphaShown = 245;
const int kSize = 300;
const double kInnerRadius = 38;
const COLORREF kAccent = RGB(0x0B, 0x6E, 0x5F);
const double kPi = 3.141592653589793;

bool LeftButtonDown() {
  // Left-handed mice swap the buttons, and this asks about the physical one.
  const int key = ::GetSystemMetrics(SM_SWAPBUTTON) ? VK_RBUTTON : VK_LBUTTON;
  return (::GetAsyncKeyState(key) & 0x8000) != 0;
}

bool ShiftDown() { return (::GetAsyncKeyState(VK_SHIFT) & 0x8000) != 0; }

std::wstring Utf16FromUtf8(const std::string& text) {
  if (text.empty()) return std::wstring();
  const int length = ::MultiByteToWideChar(CP_UTF8, 0, text.data(),
                                           static_cast<int>(text.size()), nullptr, 0);
  std::wstring wide(length, L'\0');
  ::MultiByteToWideChar(CP_UTF8, 0, text.data(), static_cast<int>(text.size()), wide.data(),
                        length);
  return wide;
}

std::vector<std::string> PathsIn(IDataObject* data) {
  std::vector<std::string> paths;
  FORMATETC format = {CF_HDROP, nullptr, DVASPECT_CONTENT, -1, TYMED_HGLOBAL};
  STGMEDIUM medium = {};
  if (FAILED(data->GetData(&format, &medium))) return paths;
  HDROP drop = static_cast<HDROP>(::GlobalLock(medium.hGlobal));
  if (drop != nullptr) {
    const UINT count = ::DragQueryFileW(drop, 0xFFFFFFFF, nullptr, 0);
    for (UINT i = 0; i < count; i++) {
      const UINT length = ::DragQueryFileW(drop, i, nullptr, 0);
      std::wstring path(length + 1, L'\0');
      ::DragQueryFileW(drop, i, path.data(), length + 1);
      path.resize(length);
      paths.push_back(Utf8FromUtf16(path.c_str()));
    }
    ::GlobalUnlock(medium.hGlobal);
  }
  ::ReleaseStgMedium(&medium);
  return paths;
}

// Says the drag goes on until the button is released, and Escape cancels it.
class DropSource : public IDropSource {
 public:
  HRESULT STDMETHODCALLTYPE QueryInterface(REFIID id, void** out) override {
    if (id == IID_IUnknown || id == IID_IDropSource) {
      *out = static_cast<IDropSource*>(this);
      return S_OK;
    }
    *out = nullptr;
    return E_NOINTERFACE;
  }
  // Lives on the stack for the length of the drag, so counting references frees nothing.
  ULONG STDMETHODCALLTYPE AddRef() override { return 1; }
  ULONG STDMETHODCALLTYPE Release() override { return 1; }
  HRESULT STDMETHODCALLTYPE QueryContinueDrag(BOOL escape, DWORD keys) override {
    if (escape) return DRAGDROP_S_CANCEL;
    return (keys & MK_LBUTTON) ? S_OK : DRAGDROP_S_DROP;
  }
  HRESULT STDMETHODCALLTYPE GiveFeedback(DWORD) override { return DRAGDROP_S_USEDEFAULTCURSORS; }
};

// What other apps get from a drop: the same thing Explorer would give them for these files.
IDataObject* DataObjectFor(const std::vector<std::wstring>& paths) {
  std::vector<PIDLIST_ABSOLUTE> items;
  for (const auto& path : paths) {
    PIDLIST_ABSOLUTE item = nullptr;
    if (SUCCEEDED(::SHParseDisplayName(path.c_str(), nullptr, &item, 0, nullptr))) {
      items.push_back(item);
    }
  }
  IDataObject* data = nullptr;
  if (!items.empty()) {
    IShellItemArray* array = nullptr;
    const std::vector<PCIDLIST_ABSOLUTE> ids(items.begin(), items.end());
    if (SUCCEEDED(::SHCreateShellItemArrayFromIDLists(static_cast<UINT>(ids.size()), ids.data(),
                                                      &array))) {
      array->BindToHandler(nullptr, BHID_DataObject, IID_PPV_ARGS(&data));
      array->Release();
    }
  }
  for (auto item : items) ::CoTaskMemFree(item);
  return data;
}

std::wstring WideFromUtf8(const std::string& text) {
  if (text.empty()) return std::wstring();
  const int length = ::MultiByteToWideChar(CP_UTF8, 0, text.c_str(), -1, nullptr, 0);
  std::wstring wide(length, L'\0');
  ::MultiByteToWideChar(CP_UTF8, 0, text.c_str(), -1, wide.data(), length);
  wide.resize(length - 1);
  return wide;
}

// The "paths" list in a call from Flutter.
std::vector<std::wstring> PathsFrom(const EncodableValue* arguments) {
  std::vector<std::wstring> paths;
  const auto* map = std::get_if<EncodableMap>(arguments);
  if (map == nullptr) return paths;
  const auto found = map->find(EncodableValue("paths"));
  if (found == map->end()) return paths;
  const auto* list = std::get_if<EncodableList>(&found->second);
  if (list == nullptr) return paths;
  for (const auto& each : *list) {
    if (const auto* path = std::get_if<std::string>(&each)) paths.push_back(WideFromUtf8(*path));
  }
  return paths;
}

EncodableValue PathsArgument(const std::vector<std::string>& paths) {
  EncodableList list;
  for (const auto& path : paths) list.push_back(EncodableValue(path));
  return EncodableValue(list);
}

}  // namespace

ShiftDrag::ShiftDrag(flutter::BinaryMessenger* messenger, HWND app_window)
    : app_window_(app_window) {
  channel_ = std::make_unique<flutter::MethodChannel<EncodableValue>>(
      messenger, "radial/shift_drag", &flutter::StandardMethodCodec::GetInstance());
  channel_->SetMethodCallHandler([this](const auto& call, auto result) {
    if (call.method_name() == "showWindow") {
      ::ShowWindow(app_window_, SW_RESTORE);
      ::SetForegroundWindow(app_window_);
    } else if (call.method_name() == "dragOut") {
      // A drag holds this thread until the drop, so Flutter gets its answer first.
      result->Success(EncodableValue(true));
      DragOut(PathsFrom(call.arguments()));
      return;
    } else if (call.method_name() == "showChip") {
      ShowChip(PathsFrom(call.arguments()));
    }
    result->Success();
  });

  ::OleInitialize(nullptr);
  WNDCLASSW panel_class = {};
  panel_class.lpfnWndProc = PanelProc;
  panel_class.hInstance = ::GetModuleHandle(nullptr);
  panel_class.lpszClassName = kPanelClass;
  panel_class.hCursor = ::LoadCursor(nullptr, IDC_ARROW);
  ::RegisterClassW(&panel_class);
  panel_ = ::CreateWindowExW(WS_EX_LAYERED | WS_EX_TOPMOST | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE,
                             kPanelClass, L"", WS_POPUP, 0, 0, kSize, kSize, nullptr, nullptr,
                             panel_class.hInstance, this);
  if (panel_ == nullptr) return;
  ::RegisterDragDrop(panel_, this);
  ::SetTimer(panel_, kTimer, kCheckEveryMs, nullptr);

  WNDCLASSW chip_class = {};
  chip_class.lpfnWndProc = ChipProc;
  chip_class.hInstance = panel_class.hInstance;
  chip_class.lpszClassName = kChipClass;
  chip_class.hCursor = ::LoadCursor(nullptr, IDC_HAND);
  chip_class.hbrBackground = reinterpret_cast<HBRUSH>(COLOR_WINDOW + 1);
  ::RegisterClassW(&chip_class);
  chip_ = ::CreateWindowExW(WS_EX_TOPMOST | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE, kChipClass, L"",
                            WS_POPUP | WS_BORDER, 0, 0, kChipWidth, kChipHeight, nullptr, nullptr,
                            chip_class.hInstance, this);
}

void ShiftDrag::DragOut(const std::vector<std::wstring>& paths) {
  if (paths.empty() || dragging_out_ || !LeftButtonDown()) return;
  IDataObject* data = DataObjectFor(paths);
  if (data == nullptr) return;
  dragging_out_ = true;
  // Whatever the mouse was captured by would otherwise keep getting its moves.
  ::ReleaseCapture();
  DropSource source;
  DWORD effect = DROPEFFECT_NONE;
  ::DoDragDrop(data, &source, DROPEFFECT_COPY, &effect);
  data->Release();
  dragging_out_ = false;
}

void ShiftDrag::ShowChip(std::vector<std::wstring> paths) {
  if (chip_ == nullptr || paths.empty()) return;
  chip_paths_ = std::move(paths);
  POINT cursor = {};
  ::GetCursorPos(&cursor);
  const HMONITOR monitor = ::MonitorFromPoint(cursor, MONITOR_DEFAULTTONEAREST);
  MONITORINFO info = {};
  info.cbSize = sizeof(info);
  ::GetMonitorInfoW(monitor, &info);
  const int x = std::min(cursor.x + 12, info.rcWork.right - kChipWidth);
  const int y = std::min(cursor.y + 12, info.rcWork.bottom - kChipHeight);
  ::SetWindowPos(chip_, HWND_TOPMOST, std::max<int>(x, info.rcWork.left),
                 std::max<int>(y, info.rcWork.top), kChipWidth, kChipHeight,
                 SWP_NOACTIVATE | SWP_SHOWWINDOW);
  ::InvalidateRect(chip_, nullptr, TRUE);
  ::SetTimer(chip_, kChipTimer, kChipLifetimeMs, nullptr);
}

void ShiftDrag::HideChip() {
  if (chip_ == nullptr) return;
  ::KillTimer(chip_, kChipTimer);
  ::ShowWindow(chip_, SW_HIDE);
}

void ShiftDrag::PaintChip() {
  PAINTSTRUCT paint;
  HDC dc = ::BeginPaint(chip_, &paint);
  ::SetBkMode(dc, TRANSPARENT);
  std::wstring title;
  if (chip_paths_.size() == 1) {
    const size_t slash = chip_paths_[0].find_last_of(L"\\/");
    title = slash == std::wstring::npos ? chip_paths_[0] : chip_paths_[0].substr(slash + 1);
  } else {
    title = std::to_wstring(chip_paths_.size()) + L" files";
  }
  RECT top = {12, 8, kChipWidth - 12, 30};
  ::DrawTextW(dc, title.c_str(), -1, &top, DT_SINGLELINE | DT_PATH_ELLIPSIS | DT_NOPREFIX);
  RECT bottom = {12, 30, kChipWidth - 12, 50};
  ::SetTextColor(dc, ::GetSysColor(COLOR_GRAYTEXT));
  ::DrawTextW(dc, L"Drag to another app", -1, &bottom, DT_SINGLELINE | DT_NOPREFIX);
  ::EndPaint(chip_, &paint);
}

LRESULT CALLBACK ShiftDrag::ChipProc(HWND window, UINT message, WPARAM wparam, LPARAM lparam) {
  if (message == WM_NCCREATE) {
    const auto* create = reinterpret_cast<CREATESTRUCTW*>(lparam);
    ::SetWindowLongPtrW(window, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(create->lpCreateParams));
  }
  auto* self = reinterpret_cast<ShiftDrag*>(::GetWindowLongPtrW(window, GWLP_USERDATA));
  if (self != nullptr) {
    switch (message) {
      case WM_PAINT:
        self->PaintChip();
        return 0;
      case WM_TIMER:
        if (wparam == kChipTimer) self->HideChip();
        return 0;
      case WM_MOUSEACTIVATE:
        return MA_NOACTIVATE;
      case WM_LBUTTONDOWN: {
        POINT point = {GET_X_LPARAM(lparam), GET_Y_LPARAM(lparam)};
        ::ClientToScreen(window, &point);
        if (::DragDetect(window, point)) {
          self->DragOut(self->chip_paths_);
          self->HideChip();
        }
        return 0;
      }
      default:
        break;
    }
  }
  return ::DefWindowProcW(window, message, wparam, lparam);
}

ShiftDrag::~ShiftDrag() {
  channel_->SetMethodCallHandler(nullptr);
  if (panel_ != nullptr) {
    ::KillTimer(panel_, kTimer);
    ::RevokeDragDrop(panel_);
    ::DestroyWindow(panel_);
  }
  if (chip_ != nullptr) ::DestroyWindow(chip_);
  ::OleUninitialize();
}

HRESULT ShiftDrag::QueryInterface(REFIID id, void** out) {
  if (id == IID_IUnknown || id == IID_IDropTarget) {
    *out = static_cast<IDropTarget*>(this);
    return S_OK;
  }
  *out = nullptr;
  return E_NOINTERFACE;
}

ULONG ShiftDrag::AddRef() { return 1; }

ULONG ShiftDrag::Release() { return 1; }

LRESULT CALLBACK ShiftDrag::PanelProc(HWND window, UINT message, WPARAM wparam, LPARAM lparam) {
  if (message == WM_NCCREATE) {
    const auto* create = reinterpret_cast<CREATESTRUCTW*>(lparam);
    ::SetWindowLongPtrW(window, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(create->lpCreateParams));
  }
  auto* self = reinterpret_cast<ShiftDrag*>(::GetWindowLongPtrW(window, GWLP_USERDATA));
  if (self != nullptr) {
    if (message == WM_TIMER && wparam == kTimer) {
      self->Tick();
      return 0;
    }
    if (message == WM_PAINT) {
      self->Paint();
      return 0;
    }
    if (message == WM_MOUSEACTIVATE) return MA_NOACTIVATE;
  }
  return ::DefWindowProcW(window, message, wparam, lparam);
}

void ShiftDrag::Tick() {
  if (dragging_out_) return;
  if (!LeftButtonDown()) {
    button_was_down_ = false;
    if (placed_ && paths_.empty()) {
      // No file ever arrived, so this was some other Shift-drag. Out of the way at once, or the
      // invisible window would catch the next click.
      Hide();
    } else if (placed_) {
      const ULONGLONG now = ::GetTickCount64();
      if (hide_at_ == 0) {
        hide_at_ = now + kHideDelayMs;
      } else if (now >= hide_at_) {
        Hide();
      }
    }
    return;
  }
  POINT cursor;
  ::GetCursorPos(&cursor);
  if (!button_was_down_) {
    button_was_down_ = true;
    pressed_at_ = cursor;
  }
  if (placed_ || !ShiftDown()) return;
  if (std::abs(cursor.x - pressed_at_.x) + std::abs(cursor.y - pressed_at_.y) < kDragDistance) {
    return;
  }
  Place(cursor);
}

double ShiftDrag::Scale() const { return ::GetDpiForWindow(app_window_) / 96.0; }

void ShiftDrag::Place(POINT cursor) {
  const int size = static_cast<int>(kSize * Scale());
  int left = cursor.x - size / 2;
  int top = cursor.y - size / 2;
  MONITORINFO monitor = {sizeof(monitor)};
  if (::GetMonitorInfoW(::MonitorFromPoint(cursor, MONITOR_DEFAULTTONEAREST), &monitor)) {
    const RECT& work = monitor.rcWork;
    left = std::max<int>(work.left, std::min<int>(left, work.right - size));
    top = std::max<int>(work.top, std::min<int>(top, work.bottom - size));
  }
  slices_.clear();
  paths_.clear();
  highlighted_ = -1;
  revealed_ = false;
  hide_at_ = 0;
  drag_++;
  // The window gives up its region when set, and round means the corners don't catch drags.
  ::SetWindowRgn(panel_, ::CreateEllipticRgn(0, 0, size, size), FALSE);
  ::SetLayeredWindowAttributes(panel_, 0, kAlphaHidden, LWA_ALPHA);
  ::SetWindowPos(panel_, HWND_TOPMOST, left, top, size, size, SWP_NOACTIVATE | SWP_SHOWWINDOW);
  placed_ = true;
}

void ShiftDrag::Reveal(std::vector<Slice> slices) {
  slices_ = std::move(slices);
  revealed_ = true;
  ::SetLayeredWindowAttributes(panel_, 0, kAlphaShown, LWA_ALPHA);
  ::InvalidateRect(panel_, nullptr, TRUE);
}

void ShiftDrag::Hide() {
  ::ShowWindow(panel_, SW_HIDE);
  placed_ = false;
  revealed_ = false;
  hide_at_ = 0;
  slices_.clear();
  drag_++;
}

void ShiftDrag::AskForSlices() {
  const unsigned int drag = drag_;
  EncodableMap arguments = {{EncodableValue("paths"), PathsArgument(paths_)}};
  auto answered = [this, drag](const EncodableValue* answer) {
    if (drag != drag_) return;
    std::vector<Slice> slices;
    if (const auto* list = answer ? std::get_if<EncodableList>(answer) : nullptr) {
      for (const auto& item : *list) {
        const auto* map = std::get_if<EncodableMap>(&item);
        if (map == nullptr) continue;
        const auto id = map->find(EncodableValue("id"));
        const auto label = map->find(EncodableValue("label"));
        if (id == map->end() || label == map->end()) continue;
        slices.push_back({std::get<std::string>(id->second),
                          Utf16FromUtf8(std::get<std::string>(label->second))});
      }
    }
    // Nothing can convert this file, so nothing appears.
    if (slices.empty()) {
      Hide();
    } else {
      Reveal(std::move(slices));
    }
  };
  channel_->InvokeMethod(
      "menuFor", std::make_unique<EncodableValue>(arguments),
      std::make_unique<flutter::MethodResultFunctions<EncodableValue>>(
          [answered](const EncodableValue* answer) { answered(answer); },
          [answered](const std::string&, const std::string&, const EncodableValue*) {
            answered(nullptr);
          },
          [answered]() { answered(nullptr); }));
}

int ShiftDrag::SliceAt(POINTL point) const {
  RECT frame;
  ::GetWindowRect(panel_, &frame);
  const double centre_x = (frame.left + frame.right) / 2.0;
  const double centre_y = (frame.top + frame.bottom) / 2.0;
  return RadialSliceAt(point.x - centre_x, centre_y - point.y, static_cast<int>(slices_.size()),
                       kInnerRadius * Scale());
}

void ShiftDrag::SetHighlight(int slice) {
  if (slice == highlighted_) return;
  highlighted_ = slice;
  ::InvalidateRect(panel_, nullptr, FALSE);
}

HRESULT ShiftDrag::DragEnter(IDataObject* data, DWORD, POINTL point, DWORD* effect) {
  paths_ = PathsIn(data);
  if (paths_.empty()) {
    *effect = DROPEFFECT_NONE;
    return S_OK;
  }
  // Still over the menu, so not time to hide.
  hide_at_ = 0;
  if (!revealed_) AskForSlices();
  *effect = DROPEFFECT_COPY;
  return S_OK;
}

HRESULT ShiftDrag::DragOver(DWORD, POINTL point, DWORD* effect) {
  if (paths_.empty()) {
    *effect = DROPEFFECT_NONE;
    return S_OK;
  }
  const int slice = revealed_ ? SliceAt(point) : -1;
  SetHighlight(slice);
  // The centre refuses the drop, which is how to cancel.
  *effect = slice < 0 ? DROPEFFECT_NONE : DROPEFFECT_COPY;
  return S_OK;
}

HRESULT ShiftDrag::DragLeave() {
  SetHighlight(-1);
  return S_OK;
}

HRESULT ShiftDrag::Drop(IDataObject* data, DWORD, POINTL point, DWORD* effect) {
  const int slice = revealed_ ? SliceAt(point) : -1;
  if (slice < 0) {
    *effect = DROPEFFECT_NONE;
    Hide();
    return S_OK;
  }
  const std::string id = slices_[slice].id;
  const std::vector<std::string> paths = PathsIn(data);
  Hide();
  *effect = DROPEFFECT_COPY;
  EncodableMap arguments = {{EncodableValue("id"), EncodableValue(id)},
                            {EncodableValue("paths"), PathsArgument(paths)}};
  channel_->InvokeMethod("chosen", std::make_unique<EncodableValue>(arguments));
  return S_OK;
}

void ShiftDrag::Paint() {
  PAINTSTRUCT paint;
  HDC dc = ::BeginPaint(panel_, &paint);
  RECT area;
  ::GetClientRect(panel_, &area);
  const double scale = Scale();
  const int size = area.right - area.left;
  const double centre = size / 2.0;
  const double outer = centre;
  const double inner = kInnerRadius * scale;
  const COLORREF background = ::GetSysColor(COLOR_WINDOW);
  const COLORREF text = ::GetSysColor(COLOR_WINDOWTEXT);

  HBRUSH background_brush = ::CreateSolidBrush(background);
  HBRUSH accent_brush = ::CreateSolidBrush(kAccent);
  HPEN line = ::CreatePen(PS_SOLID, 1, ::GetSysColor(COLOR_3DSHADOW));
  HFONT font = ::CreateFontW(-static_cast<int>(13 * scale), 0, 0, 0, FW_SEMIBOLD, FALSE, FALSE,
                             FALSE, DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
                             CLEARTYPE_QUALITY, DEFAULT_PITCH, L"Segoe UI");
  HGDIOBJ old_pen = ::SelectObject(dc, line);
  HGDIOBJ old_brush = ::SelectObject(dc, background_brush);
  HGDIOBJ old_font = ::SelectObject(dc, font);
  ::SetBkMode(dc, TRANSPARENT);
  ::FillRect(dc, &area, background_brush);

  const int count = static_cast<int>(slices_.size());
  if (count > 0) {
    const double span = 2 * kPi / count;
    // Pie draws anticlockwise between two points, so each slice goes from its clockwise edge back.
    for (int i = 0; i < count; i++) {
      const double middle = i * span;
      // Clockwise from the top: x grows with sin, and y falls with cos.
      const double from = middle + span / 2;
      const double to = middle - span / 2;
      ::SelectObject(dc, i == highlighted_ ? accent_brush : background_brush);
      if (count == 1) {
        ::Ellipse(dc, 0, 0, size, size);
      } else {
        ::Pie(dc, 0, 0, size, size, static_cast<int>(centre + std::sin(from) * outer),
              static_cast<int>(centre - std::cos(from) * outer),
              static_cast<int>(centre + std::sin(to) * outer),
              static_cast<int>(centre - std::cos(to) * outer));
      }
    }
    for (int i = 0; i < count; i++) {
      const double middle = i * span;
      const double reach = (inner + outer) / 2;
      const int x = static_cast<int>(centre + std::sin(middle) * reach);
      const int y = static_cast<int>(centre - std::cos(middle) * reach);
      const int half_width = static_cast<int>(60 * scale);
      const int half_height = static_cast<int>(12 * scale);
      RECT label = {x - half_width, y - half_height, x + half_width, y + half_height};
      ::SetTextColor(dc, i == highlighted_ ? RGB(255, 255, 255) : text);
      ::DrawTextW(dc, slices_[i].label.c_str(), -1, &label,
                  DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX);
    }
  }

  ::SelectObject(dc, background_brush);
  const int hub = static_cast<int>(inner - 4 * scale);
  const int middle = static_cast<int>(centre);
  ::Ellipse(dc, middle - hub, middle - hub, middle + hub, middle + hub);
  ::SetTextColor(dc, text);
  RECT cancel = {middle - hub, middle - hub, middle + hub, middle + hub};
  ::DrawTextW(dc, L"Cancel", -1, &cancel, DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX);

  ::SelectObject(dc, old_font);
  ::SelectObject(dc, old_brush);
  ::SelectObject(dc, old_pen);
  ::DeleteObject(font);
  ::DeleteObject(line);
  ::DeleteObject(accent_brush);
  ::DeleteObject(background_brush);
  ::EndPaint(panel_, &paint);
}
