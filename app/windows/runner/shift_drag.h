#ifndef RUNNER_SHIFT_DRAG_H_
#define RUNNER_SHIFT_DRAG_H_

#include <flutter/binary_messenger.h>
#include <flutter/encodable_value.h>
#include <flutter/method_channel.h>
#include <oleidl.h>
#include <windows.h>

#include <memory>
#include <string>
#include <vector>

// Text the app has put in the user's language, by key, or [english] until it has.
std::wstring NativeWord(const std::string& key, const wchar_t* english);

// Shows the radial menu when a file is dragged with Shift held, anywhere on Windows. There is no
// system-wide way to see a drag start, so while the left button is down with Shift held, an invisible
// window sits under the cursor. Only a file drag entering it makes it appear, so other Shift-drags,
// such as selecting text, see nothing. This needs no hooks and no special permissions.
class ShiftDrag : public IDropTarget {
 public:
  ShiftDrag(flutter::BinaryMessenger* messenger, HWND app_window);
  ~ShiftDrag();

  ShiftDrag(const ShiftDrag&) = delete;
  ShiftDrag& operator=(const ShiftDrag&) = delete;

  // IUnknown. This object belongs to FlutterWindow, so counting references frees nothing.
  HRESULT STDMETHODCALLTYPE QueryInterface(REFIID id, void** out) override;
  ULONG STDMETHODCALLTYPE AddRef() override;
  ULONG STDMETHODCALLTYPE Release() override;

  // IDropTarget.
  HRESULT STDMETHODCALLTYPE DragEnter(IDataObject* data, DWORD keys, POINTL point,
                                      DWORD* effect) override;
  HRESULT STDMETHODCALLTYPE DragOver(DWORD keys, POINTL point, DWORD* effect) override;
  HRESULT STDMETHODCALLTYPE DragLeave() override;
  HRESULT STDMETHODCALLTYPE Drop(IDataObject* data, DWORD keys, POINTL point,
                                 DWORD* effect) override;

 private:
  struct Slice {
    std::string id;
    std::wstring label;
  };

  static LRESULT CALLBACK PanelProc(HWND window, UINT message, WPARAM wparam, LPARAM lparam);
  static LRESULT CALLBACK ChipProc(HWND window, UINT message, WPARAM wparam, LPARAM lparam);

  // Drags files out to other apps, returning once they're dropped. Called with the button down.
  void DragOut(const std::vector<std::wstring>& paths);
  void ShowChip(std::vector<std::wstring> paths);
  void HideChip();
  void PaintChip();

  void Tick();
  void Place(POINT cursor);
  void Reveal(std::vector<Slice> slices);
  void Hide();
  void Paint();
  void AskForSlices();
  int SliceAt(POINTL point) const;
  double Scale() const;
  void SetHighlight(int slice);

  std::unique_ptr<flutter::MethodChannel<flutter::EncodableValue>> channel_;
  HWND app_window_;
  HWND panel_ = nullptr;
  HWND chip_ = nullptr;
  std::vector<std::wstring> chip_paths_;
  // While our own files are being dragged out, Shift mustn't bring the menu up over them.
  bool dragging_out_ = false;

  std::vector<Slice> slices_;
  std::vector<std::string> paths_;
  int highlighted_ = -1;
  bool button_was_down_ = false;
  POINT pressed_at_ = {};
  bool placed_ = false;
  bool revealed_ = false;
  ULONGLONG hide_at_ = 0;
  // Each drag gets a number, so a late answer about an old drag is ignored.
  unsigned int drag_ = 0;
};

#endif  // RUNNER_SHIFT_DRAG_H_
