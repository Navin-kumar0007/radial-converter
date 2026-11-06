#include "flutter_window.h"

#include <optional>

#include "flutter/generated_plugin_registrant.h"
#include "resource.h"

namespace {

const UINT kTrayMessage = WM_APP + 1;
const UINT kTrayId = 1;
const UINT kMenuOpen = 1;
const UINT kMenuQuit = 2;

}  // namespace

FlutterWindow::FlutterWindow(const flutter::DartProject& project)
    : project_(project) {}

FlutterWindow::~FlutterWindow() {}

bool FlutterWindow::OnCreate() {
  if (!Win32Window::OnCreate()) {
    return false;
  }

  RECT frame = GetClientArea();

  // The size here must match the window dimensions to avoid unnecessary surface
  // creation / destruction in the startup path.
  flutter_controller_ = std::make_unique<flutter::FlutterViewController>(
      frame.right - frame.left, frame.bottom - frame.top, project_);
  // Ensure that basic setup of the controller was successful.
  if (!flutter_controller_->engine() || !flutter_controller_->view()) {
    return false;
  }
  RegisterPlugins(flutter_controller_->engine());
  SetChildContent(flutter_controller_->view()->GetNativeWindow());
  taskbar_created_ = ::RegisterWindowMessageW(L"TaskbarCreated");
  AddTrayIcon();
  shift_drag_ = std::make_unique<ShiftDrag>(flutter_controller_->engine()->messenger(), GetHandle());

  flutter_controller_->engine()->SetNextFrameCallback([&]() {
    this->Show();
  });

  // Flutter can complete the first frame before the "show window" callback is
  // registered. The following call ensures a frame is pending to ensure the
  // window is shown. It is a no-op if the first frame hasn't completed yet.
  flutter_controller_->ForceRedraw();

  return true;
}

void FlutterWindow::AddTrayIcon() {
  tray_ = {};
  tray_.cbSize = sizeof(tray_);
  tray_.hWnd = GetHandle();
  tray_.uID = kTrayId;
  tray_.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
  tray_.uCallbackMessage = kTrayMessage;
  tray_.hIcon = ::LoadIconW(::GetModuleHandleW(nullptr), MAKEINTRESOURCEW(IDI_APP_ICON));
  wcscpy_s(tray_.szTip, L"Radial Converter");
  tray_added_ = ::Shell_NotifyIconW(NIM_ADD, &tray_) != FALSE;
}

void FlutterWindow::RemoveTrayIcon() {
  if (tray_added_) ::Shell_NotifyIconW(NIM_DELETE, &tray_);
  tray_added_ = false;
}

void FlutterWindow::HideToTray() {
  // With no icon there'd be no way back, nor any way to quit, so closing has to quit.
  if (!tray_added_) {
    ::DestroyWindow(GetHandle());
    return;
  }
  ::ShowWindow(GetHandle(), SW_HIDE);
  if (told_about_tray_) return;
  told_about_tray_ = true;
  tray_.uFlags = NIF_INFO;
  tray_.dwInfoFlags = NIIF_NONE;
  // Cut short rather than fail: these have fixed room, and a translation may be longer.
  wcsncpy_s(tray_.szInfoTitle, NativeWord("trayStillRunning", L"Radial Converter is still running").c_str(),
            _TRUNCATE);
  wcsncpy_s(tray_.szInfo,
            NativeWord("trayHowToQuit", L"Shift-drag keeps working. To quit, right-click this icon.").c_str(),
            _TRUNCATE);
  ::Shell_NotifyIconW(NIM_MODIFY, &tray_);
  tray_.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
}

void FlutterWindow::ShowFromTray() {
  ::ShowWindow(GetHandle(), SW_RESTORE);
  ::SetForegroundWindow(GetHandle());
}

void FlutterWindow::ShowTrayMenu() {
  HMENU menu = ::CreatePopupMenu();
  if (menu == nullptr) return;
  ::AppendMenuW(menu, MF_STRING, kMenuOpen, NativeWord("trayOpen", L"Open Radial Converter").c_str());
  ::AppendMenuW(menu, MF_SEPARATOR, 0, nullptr);
  ::AppendMenuW(menu, MF_STRING, kMenuQuit, NativeWord("trayQuit", L"Quit").c_str());
  ::SetMenuDefaultItem(menu, kMenuOpen, FALSE);
  POINT cursor = {};
  ::GetCursorPos(&cursor);
  // Without these two the menu doesn't close when clicking elsewhere, as Windows documents.
  ::SetForegroundWindow(GetHandle());
  const UINT chosen = ::TrackPopupMenu(menu, TPM_RETURNCMD | TPM_RIGHTBUTTON | TPM_NONOTIFY, cursor.x,
                                       cursor.y, 0, GetHandle(), nullptr);
  ::PostMessageW(GetHandle(), WM_NULL, 0, 0);
  ::DestroyMenu(menu);
  if (chosen == kMenuOpen) ShowFromTray();
  if (chosen == kMenuQuit) ::DestroyWindow(GetHandle());
}

void FlutterWindow::OnDestroy() {
  RemoveTrayIcon();
  shift_drag_ = nullptr;
  if (flutter_controller_) {
    flutter_controller_ = nullptr;
  }

  Win32Window::OnDestroy();
}

LRESULT
FlutterWindow::MessageHandler(HWND hwnd, UINT const message,
                              WPARAM const wparam,
                              LPARAM const lparam) noexcept {
  if (message == WM_CLOSE) {
    HideToTray();
    return 0;
  }
  if (message == kTrayMessage) {
    if (lparam == WM_LBUTTONUP) ShowFromTray();
    if (lparam == WM_RBUTTONUP) ShowTrayMenu();
    return 0;
  }
  if (taskbar_created_ != 0 && message == taskbar_created_) {
    AddTrayIcon();
    return 0;
  }

  // Give Flutter, including plugins, an opportunity to handle window messages.
  if (flutter_controller_) {
    std::optional<LRESULT> result =
        flutter_controller_->HandleTopLevelWindowProc(hwnd, message, wparam,
                                                      lparam);
    if (result) {
      return *result;
    }
  }

  switch (message) {
    case WM_FONTCHANGE:
      flutter_controller_->engine()->ReloadSystemFonts();
      break;
  }

  return Win32Window::MessageHandler(hwnd, message, wparam, lparam);
}
