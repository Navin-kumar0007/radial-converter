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
AppName=Radial Converter
AppVersion={#AppVersion}
AppPublisher=Radial Converter contributors
AppPublisherURL=https://github.com/Navin-kumar0007/radial-converter
DefaultDirName={autopf}\Radial Converter
DefaultGroupName=Radial Converter
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir={#Output}
OutputBaseFilename=Radial-Converter-{#AppVersion}-windows-setup
SetupIconFile=runner\resources\app_icon.ico
UninstallDisplayIcon={app}\radialconverter.exe
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
CloseApplications=force

[Files]
Source: "{#Source}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Radial Converter"; Filename: "{app}\radialconverter.exe"
Name: "{autodesktop}\Radial Converter"; Filename: "{app}\radialconverter.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Add a desktop shortcut"; Flags: unchecked

[Run]
Filename: "{app}\radialconverter.exe"; Description: "Open Radial Converter"; Flags: nowait postinstall skipifsilent
