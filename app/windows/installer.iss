; The Windows installer, built by CI with Inno Setup. For one user, so it needs no administrator
; rights, which also means no scary prompt. Version and output folder come from the command line.

#ifndef AppVersion
  #define AppVersion "0.0.0"
#endif
#ifndef Output
  #define Output "."
#endif
#ifndef Source
  #define Source "..\build\windows\x64\runner\Release"
#endif

[Setup]
; Never change this once released: it's how Windows knows a new version replaces an old one.
AppId={{6E0C9A0E-5B1F-4C6B-9D26-3F6B7A2C1E44}
AppName=ShiftDrop
AppVersion={#AppVersion}
AppPublisher=ShiftDrop contributors
AppPublisherURL=https://github.com/Navin-kumar0007/shiftdrop
DefaultDirName={autopf}\ShiftDrop
DefaultGroupName=ShiftDrop
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir={#Output}
OutputBaseFilename=ShiftDrop-{#AppVersion}-windows-setup
SetupIconFile=runner\resources\app_icon.ico
UninstallDisplayIcon={app}\shiftdrop.exe
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
CloseApplications=force

[Files]
Source: "{#Source}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\ShiftDrop"; Filename: "{app}\shiftdrop.exe"
Name: "{autodesktop}\ShiftDrop"; Filename: "{app}\shiftdrop.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Add a desktop shortcut"; Flags: unchecked

[Registry]
; Created by the app's "Open at login" switch, not here. Uninstalling removes it.
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: none; ValueName: "ShiftDrop"; Flags: uninsdeletevalue

[Run]
Filename: "{app}\shiftdrop.exe"; Description: "Open ShiftDrop"; Flags: nowait postinstall skipifsilent
