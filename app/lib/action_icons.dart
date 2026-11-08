import 'package:flutter/material.dart';
import 'package:radial_core/radial_core.dart';

/// The icon for a slice. Icon sets can be swapped here in one place.
IconData iconFor(RadialAction action) {
  final id = action.id;
  if (id.startsWith('fit-whatsapp')) return Icons.chat_outlined;
  if (id.startsWith('fit-email')) return Icons.mail_outline;
  if (id == 'fit-instagram') return Icons.crop_portrait;
  if (id == 'fit-web') return Icons.language;
  if (id.startsWith('fit-')) return Icons.compress;
  if (id.endsWith('-compress')) return Icons.compress;
  if (id.endsWith('-crop')) return Icons.crop;
  if (id.endsWith('-resize')) return Icons.photo_size_select_large;
  if (id.endsWith('-rotate')) return Icons.rotate_right;
  if (id.endsWith('-flip')) return Icons.flip;
  if (id.endsWith('-trim')) return Icons.content_cut;
  if (id.endsWith('-merge')) return Icons.merge_type;
  if (id.endsWith('-strip-metadata')) return Icons.visibility_off_outlined;
  if (id.endsWith('-extract-audio') || id == 'video-to-mp3' || id == 'video-to-m4a') {
    return Icons.music_note_outlined;
  }
  if (id == 'video-mute') return Icons.volume_off_outlined;
  if (id == 'audio-normalise') return Icons.equalizer;
  if (id == 'audio-bitrate') return Icons.tune;
  if (id == 'pdf-split') return Icons.call_split;
  if (id == 'pdf-extract-pages') return Icons.file_copy_outlined;
  if (id == 'pdf-add-password') return Icons.lock_outline;
  if (id == 'pdf-remove-password') return Icons.lock_open_outlined;
  if (id == 'subtitle-shift') return Icons.schedule;
  if (id == 'archive-extract') return Icons.unarchive_outlined;
  if (id == 'folder-compress') return Icons.folder_zip_outlined;
  return switch (action.output?.family) {
    FileFamily.image => Icons.image_outlined,
    FileFamily.video => Icons.movie_outlined,
    FileFamily.audio => Icons.music_note_outlined,
    FileFamily.pdf => Icons.picture_as_pdf_outlined,
    FileFamily.archive => Icons.inventory_2_outlined,
    FileFamily.subtitle => Icons.subtitles_outlined,
    FileFamily.document => Icons.description_outlined,
    _ => Icons.auto_awesome_outlined,
  };
}
