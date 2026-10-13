/* Finished recordings selected for the jam. See public/audio/music/CREDITS.md. */
export const canonicalMusicId = id => ({ neeti: 'niti', superover: 'cricket', carrom_puzzles: 'carrom' }[id] || id);
export const MUSIC_TRACKS = {
  wordal: { file: 'wordal-chill-jazz.mp3', title: 'Chill Jazz', artist: 'Alex McCulloch (Pro Sensory)', mood: 'A relaxed jazz backdrop', source: 'https://opengameart.org/content/chill-jazz', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', level: 0.9 },
  niti: { file: 'neeti-peace-at-last.ogg', title: 'Peace at last', artist: 'Jan125', mood: 'A reflective piano loop', source: 'https://opengameart.org/content/peace-at-last', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', level: 1 },
  jodo: { file: 'jodo-feel-good-island.ogg', title: 'Feel good island', artist: 'Brandon75689 (Brandon Morris)', mood: 'Playful piano, marimba and rhythm', source: 'https://opengameart.org/node/4797', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', level: 0.85 },
  carrom: { file: 'carrom-cozy-puzzle.mp3', title: 'Cozy Puzzle In-Game 2', artist: 'MintoDog', mood: 'A cozy puzzle groove', source: 'https://opengameart.org/content/cozy-puzzle-in-game-2', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', level: 0.8 },
  cricket: { file: 'cricket-funked-up.mp3', title: 'Funked Up', artist: 'Joth', mood: 'Guitar, bass, Rhodes and drums', source: 'https://opengameart.org/content/funked-up', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', level: 0.85 },
};
export function musicTrackUrl(track) {
  return `${import.meta.env?.BASE_URL || '/'}audio/music/${track.file}`;
}
