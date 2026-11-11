#ifndef RUNNER_SHIFT_DRAG_H_
#define RUNNER_SHIFT_DRAG_H_

#include <flutter/binary_messenger.h>
#include <flutter/encodable_value.h>
#include <flutter/method_channel.h>
#include <oleidl.h>
#include <windows.h>

#include <map>
#include <memory>
#include <set>
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
    // Labels of its outer-ring choices, if it has any.
    std::vector<std::wstring> choices;
  };

  // The slices in an answer to "menuFor".
  static std::vector<Slice> SlicesFrom(const flutter::EncodableValue* answer);

  static LRESULT CALLBACK PanelProc(HWND window, UINT message, WPARAM wparam, LPARAM lparam);
  static LRESULT CALLBACK ChipProc(HWND window, UINT message, WPARAM wparam, LPARAM lparam);

  // Drags files out to other apps, returning once they're dropped. Called with the button down.
  void DragOut(const std::vector<std::wstring>& paths);
  void ShowChip(std::vector<std::wstring> paths);
  void HideChip();
  void PaintChip();

  void Tick();
  void Place(POINT cursor);
  void Reveal(std::vector<Slice> slices, bool tools);
  void Hide();
  void Paint();
  // Asks Dart what the menu offers for the dragged files, as tools or not.
  void AskForSlices(bool tools);
  // Alt pressed or let go while the menu shows: the same files, the other kind of actions.
  void SwitchMode(bool tools);
  double Scale() const;
  // The point from the menu's centre, with y growing upwards.
  void FromCentre(POINTL point, double* dx, double* dy) const;
  // Highlights what the drag is over: a slice, or past the menu one of its choices.
  void Follow(POINTL point);
  // Whether a drop where the drag last was would choose something.
  bool Choosing() const;
  bool NeedsRing() const;
  // Makes room for the outer ring, or gives it back, keeping the menu's centre where it is.
  void Resize();
  // The window takes the menu's shape, plus the highlighted slice's choices, so drags elsewhere
  // still reach the apps below.
  void Shape();
  void SetHighlight(int slice);
  // Asks Dart what the centre should say about the slice the drag has rested on.
  void AskSize();

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
  // The highlighted slice's choice on the outer ring, or -1.
  int choice_ = -1;
  // Past the menu's edge, where only a choice can be dropped on.
  bool past_menu_ = false;
  // Showing Tools rather than Convert, and what was last asked for, so each Alt change asks once.
  bool tools_ = false;
  bool asked_tools_ = false;
  bool switching_ = false;
  // What the centre says each slice's result will weigh, by slice id, such as "About 240 KB".
  std::map<std::string, std::wstring> sizes_;
  // Slices already asked about in this drag, so each is asked once.
  std::set<std::string> asked_;
  // The slice whose size is asked once the drag has rested on it.
  int resting_on_ = -1;
  bool button_was_down_ = false;
  POINT pressed_at_ = {};
  bool placed_ = false;
  bool revealed_ = false;
  ULONGLONG hide_at_ = 0;
  // Each drag gets a number, so a late answer about an old drag is ignored.
  unsigned int drag_ = 0;
};

#endif  // RUNNER_SHIFT_DRAG_H_
