
/**
  * 
  * Starts playing the main background music for the game.
  *
  * This function initiates playback of the `game_music` audio element
  * and sets its volume to a predefined loud level (`game_music_volume_loude`).
  * It's typically called once when the game starts.
  *
  * @memberof World
  */
function playGameMusic() {
    game_music.play();
    game_music.volume = game_music_volume_loude;
}

/**
   * 
   * Plays a sound effect for collecting an item, ensuring it doesn't loop indefinitely.
   *
   * This function creates and plays an audio file from the given `audioPath` with a specified `volume`.
   * The sound will only play if the game is not muted and not finished. After a `timeoutMs` duration,
   * the audio is paused and its playback position reset to the beginning. This prevents multiple
   * instances of the same sound from playing over each other and frees up audio resources.
   *
   * @param {string} audioPath - The file path to the audio sound to be played.
   * @param {number} volume - The volume level for the audio (0.0 to 1.0).
   * @param {number} timeoutMs - The time in milliseconds after which the audio should be paused and reset.
   * @memberof World
   */
function playCollectibleSound(audioPath, volume, timeoutMs) {
    if (!isMuted && !isGameFinish) {
        let audio = new Audio(audioPath);
        audio.play();
        audio.volume = volume;
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, timeoutMs);
    }
}

/**
 * 
* Plays the generic bouncing sound effect.
*
* This function creates a new `Audio` object for the bouncing sound and plays it,
* provided the game is not muted and not finished. The volume is set to a predefined
* level. A `setTimeout` is used to pause and reset the audio after 500 milliseconds,
* ensuring the sound is brief and doesn't overlap excessively.
*
* @memberof World
*/
function playBouncingSound() {
    if (!isMuted && !isGameFinish) {
        let bouncing_audio = new Audio(PATH_BOUNCING_AUDIO);
        bouncing_audio.volume = bouncing_audio_volume;
        bouncing_audio.play();
        setTimeout(() => {
            bouncing_audio.pause();
            bouncing_audio.currentTime = 0;
        }, 500);
    }
}

/**
 * 
 * Plays the specific sound effect for an enemy dying from a bounce attack (e.g., jumping on a chicken).
 *
 * This function creates a new `Audio` object for the enemy bounce death sound and plays it,
 * provided the game is not muted and not finished. The volume is set to a predefined
 * level. A `setTimeout` is used to pause and reset the audio after 800 milliseconds,
 * ensuring the sound plays fully but doesn't linger.
 *
 * @memberof World
 */
function playEnemyBounceDeadSound() {
    if (!isMuted && !isGameFinish) {
        let enemy_bouncing_dead_audio = new Audio(PATH_CHICKEN_DEATH_JUMP_AUDIO);
        enemy_bouncing_dead_audio.volume = enemy_bouncing_dead_audio_volume;
        enemy_bouncing_dead_audio.play();
        setTimeout(() => {
            enemy_bouncing_dead_audio.pause();
            enemy_bouncing_dead_audio.currentTime = 0;
        }, 800);
    }
}

/**
  * 
* Plays the chicken death sound effect.
*
* This function creates a new `Audio` object for the chicken death sound and plays it,
* provided the game is not muted and not finished. The volume is set to a predefined
* level. A `setTimeout` is used to pause and reset the audio after 1 second,
* preventing long-running audio instances and ensuring the sound is short and sharp.
*
* @memberof World
*/
function playChickenDeathSound() {
    if (!isMuted && !isGameFinish) {
        let chicken_death_audio = new Audio(PATH_CHICKEN_DEATH_AUDIO);
        chicken_death_audio.volume = chicken_death_audio_volume;
        chicken_death_audio.play();
        setTimeout(() => {
            chicken_death_audio.pause();
            chicken_death_audio.currentTime = 0;
        }, 1000);
    }
}

/**
 * 
 * Starts playing the main background game music if it's defined and its `play` method exists.
 * @memberof World
 */
function startBackgroundMusicTracks() {
    if (typeof game_music !== 'undefined' && typeof game_music.play === 'function') {
        game_music.play();
    }
    if (this.endboss && this.endboss.endbossActivated && typeof endboss_music !== 'undefined' && typeof endboss_music.play === 'function') {
        endboss_music.play();
    }
}

/**
 * 
 * Pauses all audio elements in the `allAudioArray`.
 * @memberof World
 */
function pauseAllGameAudio() {
    allAudioArray.forEach(audio => {
        if (audio && typeof audio.pause === 'function') {
            audio.pause();
        }
    });
}

/**
  * 
  * Pauses and resets specific background music tracks for the game.
  * @memberof World
  */
function pauseSpecificGameMusic() {
    if (typeof game_music !== 'undefined' && typeof game_music.pause === 'function') {
        game_music.pause();
        game_music.currentTime = 0;
    }
    if (typeof endboss_music !== 'undefined' && typeof endboss_music.pause === 'function') {
        endboss_music.pause();
        endboss_music.currentTime = 0;
    }
}