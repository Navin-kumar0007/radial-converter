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
#include <map>
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
const UINT_PTR kSizeTimer = 3;
// How long a slice stays highlighted before its size is asked, so sweeping across the ring doesn't
// start work for every slice passed. The window's menu waits as long.
const UINT kSizeDwellMs = 250;
const UINT kCheckEveryMs = 33;
// Past this many pixels a press has become a drag.
const int kDragDistance = 8;
// A drop on the menu arrives just after the button is released, so give it time.
const ULONGLONG kHideDelayMs = 400;
// Invisible, but still where a drag can find it.
const BYTE kAlphaHidden = 1;
const BYTE kAlphaShown = 245;
const int kSize = 300;
// The menu's radius, and the outer ring's width around it when a slice has choices.
const double kMenuRadius = kSize / 2.0;
const double kRingWidth = 56;
const double kInnerRadius = 38;
const COLORREF kAccent = RGB(0x0B, 0x6E, 0x5F);
const double kPi = 3.141592653589793;

bool LeftButtonDown() {
  // Left-handed mice swap the buttons, and this asks about the physical one.
  const int key = ::GetSystemMetrics(SM_SWAPBUTTON) ? VK_RBUTTON : VK_LBUTTON;
  return (::GetAsyncKeyState(key) & 0x8000) != 0;
}

bool ShiftDown() { return (::GetAsyncKeyState(VK_SHIFT) & 0x8000) != 0; }

// Held as well as Shift, the menu offers Tools instead of Convert.
bool AltDown() { return (::GetAsyncKeyState(VK_MENU) & 0x8000) != 0; }

// The outline of a piece of ring between two angles, clockwise from the top, in a window whose
// centre is at (centre, centre).
std::vector<POINT> Sector(double centre, double inner, double outer, double from, double to) {
  const int steps = 16;
  std::vector<POINT> points;
  for (int i = 0; i <= steps; i++) {
    const double angle = from + (to - from) * i / steps;
    points.push_back({static_cast<LONG>(centre + std::sin(angle) * outer),
                      static_cast<LONG>(centre - std::cos(angle) * outer)});
  }
  for (int i = steps; i >= 0; i--) {
    const double angle = from + (to - from) * i / steps;
    points.push_back({static_cast<LONG>(centre + std::sin(angle) * inner),
                      static_cast<LONG>(centre - std::cos(angle) * inner)});
  }
  return points;
}

COLORREF Mix(COLORREF a, COLORREF b) {
  return RGB((GetRValue(a) + GetRValue(b)) / 2, (GetGValue(a) + GetGValue(b)) / 2,
             (GetBValue(a) + GetBValue(b)) / 2);
}

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
    std::vector<PCIDLIST_ABSOLUTE> ids(items.begin(), items.end());
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
// Where Windows keeps what opens at sign-in, for this user only.
constexpr wchar_t kRunKey[] = L"Software\\Microsoft\\Windows\\CurrentVersion\\Run";
constexpr wchar_t kRunValue[] = L"ShiftDrop";

bool OpensAtLogin() {
  return ::RegGetValueW(HKEY_CURRENT_USER, kRunKey, kRunValue, RRF_RT_REG_SZ, nullptr, nullptr,
                        nullptr) == ERROR_SUCCESS;
}

// Opens this copy of the program, wherever it is now, hidden in the notification area.
bool SetOpensAtLogin(bool on) {
  if (!on) {
    const LSTATUS removed = ::RegDeleteKeyValueW(HKEY_CURRENT_USER, kRunKey, kRunValue);
    return removed == ERROR_SUCCESS || removed == ERROR_FILE_NOT_FOUND;
  }
  wchar_t program[MAX_PATH];
  const DWORD length = ::GetModuleFileNameW(nullptr, program, MAX_PATH);
  if (length == 0 || length == MAX_PATH) return false;
  const std::wstring command = L"\"" + std::wstring(program, length) + L"\" --hidden";
  return ::RegSetKeyValueW(HKEY_CURRENT_USER, kRunKey, kRunValue, REG_SZ, command.c_str(),
                           static_cast<DWORD>((command.size() + 1) * sizeof(wchar_t))) ==
         ERROR_SUCCESS;
}

std::map<std::string, std::wstring>& Words() {
  static std::map<std::string, std::wstring> words;
  return words;
}

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

// Moves a file to the Recycle Bin, where it can still be got back.
bool MoveToRecycleBin(const std::wstring& path) {
  // This list of paths ends with an empty one, so a path needs two zeros after it.
  std::wstring from = path;
  from.push_back(L'\0');
  SHFILEOPSTRUCTW operation = {};
  operation.wFunc = FO_DELETE;
  operation.pFrom = from.c_str();
  operation.fFlags = FOF_ALLOWUNDO | FOF_NOCONFIRMATION | FOF_SILENT | FOF_NOERRORUI;
  return ::SHFileOperationW(&operation) == 0 && !operation.fAnyOperationsAborted;
}

// Opens the folder holding a file, with it selected.
void ShowInExplorer(const std::wstring& path) {
  PIDLIST_ABSOLUTE item = nullptr;
  if (FAILED(::SHParseDisplayName(path.c_str(), nullptr, &item, 0, nullptr))) return;
  ::SHOpenFolderAndSelectItems(item, 0, nullptr, 0);
  ::CoTaskMemFree(item);
}

HFONT MenuFont(double points, double scale, int weight) {
  return ::CreateFontW(-static_cast<int>(points * scale), 0, 0, 0, weight, FALSE, FALSE, FALSE,
                       DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                       DEFAULT_PITCH, L"Segoe UI");
}

// The largest font from [largest] down to [smallest] points at which [text] fits in [width].
HFONT FittedFont(HDC dc, const std::wstring& text, int width, double scale, int weight,
                 int largest, int smallest) {
  for (int points = largest;; points--) {
    HFONT font = MenuFont(points, scale, weight);
    if (points <= smallest) return font;
    HGDIOBJ old = ::SelectObject(dc, font);
    SIZE extent = {};
    ::GetTextExtentPoint32W(dc, text.c_str(), static_cast<int>(text.size()), &extent);
    ::SelectObject(dc, old);
    if (extent.cx <= width) return font;
    ::DeleteObject(font);
  }
}

EncodableValue PathsArgument(const std::vector<std::string>& paths) {
  EncodableList list;
  for (const auto& path : paths) list.push_back(EncodableValue(path));
  return EncodableValue(list);
}

}  // namespace

std::wstring NativeWord(const std::string& key, const wchar_t* english) {
  const auto found = Words().find(key);
  return found == Words().end() ? std::wstring(english) : found->second;
}

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
    } else if (call.method_name() == "moveToTrash") {
      const auto paths = PathsFrom(call.arguments());
      result->Success(EncodableValue(paths.size() == 1 && MoveToRecycleBin(paths[0])));
      return;
    } else if (call.method_name() == "loginItem") {
      result->Success(EncodableValue(std::string(OpensAtLogin() ? "on" : "off")));
      return;
    } else if (call.method_name() == "setLoginItem") {
      bool on = false;
      if (const auto* map = std::get_if<EncodableMap>(call.arguments())) {
        const auto found = map->find(EncodableValue("on"));
        if (found != map->end()) {
          if (const auto* value = std::get_if<bool>(&found->second)) on = *value;
        }
      }
      SetOpensAtLogin(on);
      result->Success(EncodableValue(std::string(OpensAtLogin() ? "on" : "off")));
      return;
    } else if (call.method_name() == "setWords") {
      if (const auto* map = std::get_if<EncodableMap>(call.arguments())) {
        for (const auto& [key, value] : *map) {
          const auto* name = std::get_if<std::string>(&key);
          const auto* text = std::get_if<std::string>(&value);
          if (name != nullptr && text != nullptr) Words()[*name] = Utf16FromUtf8(*text);
        }
      }
    } else if (call.method_name() == "openPage") {
      // Only web pages, as a page is all the app ever opens: the newest version's download.
      std::string url;
      if (const auto* map = std::get_if<EncodableMap>(call.arguments())) {
        const auto found = map->find(EncodableValue("url"));
        if (found != map->end()) {
          if (const auto* text = std::get_if<std::string>(&found->second)) url = *text;
        }
      }
      bool opened = false;
      if (url.rfind("https://", 0) == 0) {
        const HINSTANCE done = ::ShellExecuteW(nullptr, L"open", WideFromUtf8(url).c_str(),
                                               nullptr, nullptr, SW_SHOWNORMAL);
        // ShellExecute answers with a number above 32 when it worked.
        opened = reinterpret_cast<INT_PTR>(done) > 32;
      }
      result->Success(EncodableValue(opened));
      return;
    } else if (call.method_name() == "showInFolder") {
      const auto paths = PathsFrom(call.arguments());
      if (paths.size() == 1) ShowInExplorer(paths[0]);
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
  ::DrawTextW(dc, NativeWord("dragToApp", L"Drag to another app").c_str(), -1, &bottom,
              DT_SINGLELINE | DT_NOPREFIX);
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
    if (message == WM_TIMER && wparam == kSizeTimer) {
      ::KillTimer(window, kSizeTimer);
      self->AskSize();
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
  if (revealed_ && !switching_ && AltDown() != asked_tools_) SwitchMode(AltDown());
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
  sizes_.clear();
  asked_.clear();
  highlighted_ = -1;
  choice_ = -1;
  past_menu_ = false;
  tools_ = false;
  switching_ = false;
  resting_on_ = -1;
  ::KillTimer(panel_, kSizeTimer);
  revealed_ = false;
  hide_at_ = 0;
  drag_++;
  // The window gives up its region when set, and round means the corners don't catch drags.
  ::SetWindowRgn(panel_, ::CreateEllipticRgn(0, 0, size, size), FALSE);
  ::SetLayeredWindowAttributes(panel_, 0, kAlphaHidden, LWA_ALPHA);
  ::SetWindowPos(panel_, HWND_TOPMOST, left, top, size, size, SWP_NOACTIVATE | SWP_SHOWWINDOW);
  placed_ = true;
}

void ShiftDrag::Reveal(std::vector<Slice> slices, bool tools) {
  slices_ = std::move(slices);
  tools_ = tools;
  revealed_ = true;
  Resize();
  Shape();
  ::SetLayeredWindowAttributes(panel_, 0, kAlphaShown, LWA_ALPHA);
  ::InvalidateRect(panel_, nullptr, TRUE);
}

bool ShiftDrag::NeedsRing() const {
  return std::any_of(slices_.begin(), slices_.end(),
                     [](const Slice& slice) { return !slice.choices.empty(); });
}

void ShiftDrag::Resize() {
  const int side = static_cast<int>((kSize + (NeedsRing() ? 2 * kRingWidth : 0)) * Scale());
  RECT frame;
  ::GetWindowRect(panel_, &frame);
  if (frame.right - frame.left == side) return;
  const int centre_x = (frame.left + frame.right) / 2;
  const int centre_y = (frame.top + frame.bottom) / 2;
  ::SetWindowPos(panel_, HWND_TOPMOST, centre_x - side / 2, centre_y - side / 2, side, side,
                 SWP_NOACTIVATE);
}

void ShiftDrag::Shape() {
  RECT area;
  ::GetClientRect(panel_, &area);
  const double centre = (area.right - area.left) / 2.0;
  const double scale = Scale();
  const double menu = kMenuRadius * scale;
  HRGN shape = ::CreateEllipticRgn(static_cast<int>(centre - menu), static_cast<int>(centre - menu),
                                   static_cast<int>(centre + menu) + 1,
                                   static_cast<int>(centre + menu) + 1);
  const int count = static_cast<int>(slices_.size());
  if (highlighted_ >= 0 && highlighted_ < count && !slices_[highlighted_].choices.empty()) {
    const int choices = static_cast<int>(slices_[highlighted_].choices.size());
    const double span = ChoiceSpan(count, choices);
    const double from = ChoiceAngle(0, highlighted_, count, choices) - span / 2;
    // From just inside the menu's edge, so there's no gap to fall through on the way out.
    auto points = Sector(centre, menu - 4 * scale, menu + kRingWidth * scale, from,
                         from + span * choices);
    HRGN ring = ::CreatePolygonRgn(points.data(), static_cast<int>(points.size()), WINDING);
    ::CombineRgn(shape, shape, ring, RGN_OR);
    ::DeleteObject(ring);
  }
  // The window owns the region from here on.
  ::SetWindowRgn(panel_, shape, TRUE);
}

void ShiftDrag::Hide() {
  ::ShowWindow(panel_, SW_HIDE);
  placed_ = false;
  revealed_ = false;
  hide_at_ = 0;
  slices_.clear();
  sizes_.clear();
  asked_.clear();
  resting_on_ = -1;
  highlighted_ = -1;
  choice_ = -1;
  switching_ = false;
  ::KillTimer(panel_, kSizeTimer);
  drag_++;
}

std::vector<ShiftDrag::Slice> ShiftDrag::SlicesFrom(const EncodableValue* answer) {
  std::vector<Slice> slices;
  const auto* list = answer ? std::get_if<EncodableList>(answer) : nullptr;
  if (list == nullptr) return slices;
  for (const auto& item : *list) {
    const auto* map = std::get_if<EncodableMap>(&item);
    if (map == nullptr) continue;
    const auto id = map->find(EncodableValue("id"));
    const auto label = map->find(EncodableValue("label"));
    if (id == map->end() || label == map->end()) continue;
    const auto* id_text = std::get_if<std::string>(&id->second);
    const auto* label_text = std::get_if<std::string>(&label->second);
    if (id_text == nullptr || label_text == nullptr) continue;
    Slice slice{*id_text, Utf16FromUtf8(*label_text), {}};
    const auto choices = map->find(EncodableValue("choices"));
    if (choices != map->end()) {
      if (const auto* names = std::get_if<EncodableList>(&choices->second)) {
        for (const auto& name : *names) {
          if (const auto* text = std::get_if<std::string>(&name)) {
            slice.choices.push_back(Utf16FromUtf8(*text));
          }
        }
      }
    }
    slices.push_back(std::move(slice));
  }
  return slices;
}

void ShiftDrag::AskForSlices(bool tools) {
  const unsigned int drag = drag_;
  asked_tools_ = tools;
  EncodableMap arguments = {{EncodableValue("paths"), PathsArgument(paths_)},
                            {EncodableValue("tools"), EncodableValue(tools)}};
  auto answered = [this, drag, tools](const EncodableValue* answer) {
    if (drag != drag_) return;
    std::vector<Slice> slices = SlicesFrom(answer);
    // Nothing can convert this file, so nothing appears.
    if (slices.empty()) {
      Hide();
    } else {
      Reveal(std::move(slices), tools);
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

void ShiftDrag::SwitchMode(bool tools) {
  switching_ = true;
  asked_tools_ = tools;
  const unsigned int drag = drag_;
  EncodableMap arguments = {{EncodableValue("paths"), PathsArgument(paths_)},
                            {EncodableValue("tools"), EncodableValue(tools)}};
  auto answered = [this, drag, tools](const EncodableValue* answer) {
    if (drag != drag_) return;
    switching_ = false;
    std::vector<Slice> slices = SlicesFrom(answer);
    // Nothing of that kind keeps the menu as it was, until Alt changes again.
    if (slices.empty() || !revealed_) return;
    slices_ = std::move(slices);
    tools_ = tools;
    highlighted_ = -1;
    choice_ = -1;
    resting_on_ = -1;
    sizes_.clear();
    asked_.clear();
    ::KillTimer(panel_, kSizeTimer);
    Resize();
    Shape();
    ::InvalidateRect(panel_, nullptr, TRUE);
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

void ShiftDrag::FromCentre(POINTL point, double* dx, double* dy) const {
  RECT frame;
  ::GetWindowRect(panel_, &frame);
  *dx = point.x - (frame.left + frame.right) / 2.0;
  *dy = (frame.top + frame.bottom) / 2.0 - point.y;
}

void ShiftDrag::Follow(POINTL point) {
  if (!revealed_) {
    SetHighlight(-1);
    return;
  }
  double dx, dy;
  FromCentre(point, &dx, &dy);
  const double scale = Scale();
  const double menu = kMenuRadius * scale;
  const int count = static_cast<int>(slices_.size());
  past_menu_ = std::hypot(dx, dy) > menu;
  if (past_menu_ && highlighted_ >= 0 && highlighted_ < count &&
      !slices_[highlighted_].choices.empty()) {
    const int choice = RadialChoiceAt(dx, dy, highlighted_, count,
                                      static_cast<int>(slices_[highlighted_].choices.size()), menu,
                                      menu + kRingWidth * scale);
    if (choice != choice_) {
      choice_ = choice;
      ::InvalidateRect(panel_, nullptr, FALSE);
    }
    return;
  }
  if (choice_ != -1) {
    choice_ = -1;
    ::InvalidateRect(panel_, nullptr, FALSE);
  }
  SetHighlight(past_menu_ ? -1 : RadialSliceAt(dx, dy, count, kInnerRadius * scale));
}

bool ShiftDrag::Choosing() const {
  return highlighted_ >= 0 && (!past_menu_ || choice_ >= 0);
}

void ShiftDrag::SetHighlight(int slice) {
  if (slice == highlighted_) return;
  highlighted_ = slice;
  choice_ = -1;
  // The window grows to take in this slice's choices, if it has any.
  if (revealed_) Shape();
  ::InvalidateRect(panel_, nullptr, FALSE);
  ::KillTimer(panel_, kSizeTimer);
  resting_on_ = -1;
  if (!revealed_ || slice < 0 || slice >= static_cast<int>(slices_.size())) return;
  if (asked_.count(slices_[slice].id) > 0) return;
  resting_on_ = slice;
  ::SetTimer(panel_, kSizeTimer, kSizeDwellMs, nullptr);
}

void ShiftDrag::AskSize() {
  if (!revealed_ || resting_on_ < 0 || resting_on_ >= static_cast<int>(slices_.size())) return;
  const std::string id = slices_[resting_on_].id;
  resting_on_ = -1;
  asked_.insert(id);
  const unsigned int drag = drag_;
  auto answered = [this, drag, id](const EncodableValue* answer) {
    if (drag != drag_ || answer == nullptr) return;
    const auto* size = std::get_if<std::string>(answer);
    if (size == nullptr) return;
    sizes_[id] = Utf16FromUtf8(*size);
    ::InvalidateRect(panel_, nullptr, FALSE);
  };
  EncodableMap arguments = {{EncodableValue("id"), EncodableValue(id)},
                            {EncodableValue("paths"), PathsArgument(paths_)}};
  channel_->InvokeMethod(
      "sizeOf", std::make_unique<EncodableValue>(arguments),
      std::make_unique<flutter::MethodResultFunctions<EncodableValue>>(
          [answered](const EncodableValue* answer) { answered(answer); },
          [](const std::string&, const std::string&, const EncodableValue*) {}, []() {}));
}

HRESULT ShiftDrag::DragEnter(IDataObject* data, DWORD, POINTL point, DWORD* effect) {
  paths_ = PathsIn(data);
  if (paths_.empty()) {
    *effect = DROPEFFECT_NONE;
    return S_OK;
  }
  // Still over the menu, so not time to hide.
  hide_at_ = 0;
  if (!revealed_) AskForSlices(AltDown());
  *effect = DROPEFFECT_COPY;
  return S_OK;
}

HRESULT ShiftDrag::DragOver(DWORD, POINTL point, DWORD* effect) {
  if (paths_.empty()) {
    *effect = DROPEFFECT_NONE;
    return S_OK;
  }
  Follow(point);
  // The centre refuses the drop, which is how to cancel, as does the ring between choices.
  *effect = Choosing() ? DROPEFFECT_COPY : DROPEFFECT_NONE;
  return S_OK;
}

HRESULT ShiftDrag::DragLeave() {
  SetHighlight(-1);
  return S_OK;
}

HRESULT ShiftDrag::Drop(IDataObject* data, DWORD, POINTL point, DWORD* effect) {
  Follow(point);
  if (!Choosing()) {
    *effect = DROPEFFECT_NONE;
    Hide();
    return S_OK;
  }
  const std::string id = slices_[highlighted_].id;
  const int choice = choice_;
  const std::vector<std::string> paths = PathsIn(data);
  Hide();
  *effect = DROPEFFECT_COPY;
  EncodableMap arguments = {{EncodableValue("id"), EncodableValue(id)},
                            {EncodableValue("paths"), PathsArgument(paths)}};
  if (choice >= 0) arguments[EncodableValue("choice")] = EncodableValue(choice);
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
  const double outer = kMenuRadius * scale;
  const double inner = kInnerRadius * scale;
  // The menu's square, inside the window, which has room for the ring around it.
  const int box_from = static_cast<int>(centre - outer);
  const int box_to = static_cast<int>(centre + outer);
  const COLORREF background = ::GetSysColor(COLOR_WINDOW);
  const COLORREF text = ::GetSysColor(COLOR_WINDOWTEXT);

  HBRUSH background_brush = ::CreateSolidBrush(background);
  // Fainter while one of the slice's choices is the one dropped on.
  HBRUSH accent_brush = ::CreateSolidBrush(choice_ >= 0 ? Mix(kAccent, background) : kAccent);
  HBRUSH choice_brush = ::CreateSolidBrush(kAccent);
  HPEN line = ::CreatePen(PS_SOLID, 1, ::GetSysColor(COLOR_3DSHADOW));
  HFONT font = MenuFont(13, scale, FW_SEMIBOLD);
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
        ::Ellipse(dc, box_from, box_from, box_to, box_to);
      } else {
        ::Pie(dc, box_from, box_from, box_to, box_to, static_cast<int>(centre + std::sin(from) * outer),
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

  // The highlighted slice's choices, around the menu next to it.
  if (highlighted_ >= 0 && highlighted_ < count && !slices_[highlighted_].choices.empty()) {
    const auto& choices = slices_[highlighted_].choices;
    const int total = static_cast<int>(choices.size());
    const double span = ChoiceSpan(count, total);
    const double ring_inner = outer + 4 * scale;
    const double ring_outer = outer + kRingWidth * scale - 1;
    for (int i = 0; i < total; i++) {
      const double middle = ChoiceAngle(i, highlighted_, count, total);
      auto points = Sector(centre, ring_inner, ring_outer, middle - span / 2, middle + span / 2);
      ::SelectObject(dc, i == choice_ ? choice_brush : background_brush);
      ::Polygon(dc, points.data(), static_cast<int>(points.size()));
      const double reach = (ring_inner + ring_outer) / 2;
      const int x = static_cast<int>(centre + std::sin(middle) * reach);
      const int y = static_cast<int>(centre - std::cos(middle) * reach);
      const int width = static_cast<int>(2 * reach * std::sin(span / 2) - 6 * scale);
      HFONT choice_font = FittedFont(dc, choices[i], width, scale, FW_SEMIBOLD, 11, 8);
      ::SelectObject(dc, choice_font);
      ::SetTextColor(dc, i == choice_ ? RGB(255, 255, 255) : text);
      RECT label = {x - width / 2, y - static_cast<int>(10 * scale), x + width / 2,
                    y + static_cast<int>(10 * scale)};
      ::DrawTextW(dc, choices[i].c_str(), -1, &label,
                  DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX);
      ::SelectObject(dc, font);
      ::DeleteObject(choice_font);
    }
  }

  ::SelectObject(dc, background_brush);
  const int hub = static_cast<int>(inner - 4 * scale);
  const int middle = static_cast<int>(centre);
  ::Ellipse(dc, middle - hub, middle - hub, middle + hub, middle + hub);
  ::SetTextColor(dc, text);
  const std::wstring cancel_word = NativeWord("cancel", L"Cancel");
  // In Tools, the hub says so along its top.
  if (tools_) {
    const std::wstring tools_word = NativeWord("tools", L"Tools");
    HFONT tools_font = FittedFont(dc, tools_word, static_cast<int>(hub * 1.4), scale, FW_SEMIBOLD,
                                  9, 7);
    ::SelectObject(dc, tools_font);
    ::SetTextColor(dc, kAccent);
    RECT top = {middle - hub, middle - hub + static_cast<int>(4 * scale), middle + hub,
                middle - hub + static_cast<int>(18 * scale)};
    ::DrawTextW(dc, tools_word.c_str(), -1, &top, DT_CENTER | DT_TOP | DT_SINGLELINE | DT_NOPREFIX);
    ::SelectObject(dc, font);
    ::DeleteObject(tools_font);
    ::SetTextColor(dc, text);
  }
  // Named apart from [size], the panel's width, declared above.
  const std::wstring* size_text = nullptr;
  if (highlighted_ >= 0 && highlighted_ < count) {
    const auto found = sizes_.find(slices_[highlighted_].id);
    if (found != sizes_.end()) size_text = &found->second;
  }
  if (size_text == nullptr) {
    RECT cancel = {middle - hub, middle - hub, middle + hub, middle + hub};
    ::DrawTextW(dc, cancel_word.c_str(), -1, &cancel,
                DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX);
  } else {
    // The size above, Cancel below, both inside the hub.
    const int room = static_cast<int>(hub * 2 - 8 * scale);
    const int gap = static_cast<int>(2 * scale);
    HFONT size_font = FittedFont(dc, *size_text, room, scale, FW_BOLD, 11, 7);
    HFONT cancel_font = MenuFont(10, scale, FW_NORMAL);
    ::SelectObject(dc, size_font);
    RECT above = {middle - hub, middle - hub, middle + hub, middle - gap};
    ::DrawTextW(dc, size_text->c_str(), -1, &above,
                DT_CENTER | DT_BOTTOM | DT_SINGLELINE | DT_NOPREFIX);
    ::SelectObject(dc, cancel_font);
    ::SetTextColor(dc, ::GetSysColor(COLOR_GRAYTEXT));
    RECT below = {middle - hub, middle + gap, middle + hub, middle + hub};
    ::DrawTextW(dc, cancel_word.c_str(), -1, &below,
                DT_CENTER | DT_TOP | DT_SINGLELINE | DT_NOPREFIX);
    ::SelectObject(dc, font);
    ::DeleteObject(cancel_font);
    ::DeleteObject(size_font);
  }

  ::SelectObject(dc, old_font);
  ::SelectObject(dc, old_brush);
  ::SelectObject(dc, old_pen);
  ::DeleteObject(font);
  ::DeleteObject(line);
  ::DeleteObject(accent_brush);
  ::DeleteObject(choice_brush);
  ::DeleteObject(background_brush);
  ::EndPaint(panel_, &paint);
}
