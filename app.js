let $lcKB = $("div#keyboard-lower-container");
let $ucKB = $("div#keyboard-upper-container");
let $endBtn = $("button#restart");
let sentences = [
  "ten ate neite ate nee enet ite ate inet ent eate",
  "Too ato too nOt enot one totA not anot tOO aNot",
  "oat itain oat tain nate eate tea anne inant nean",
  "itant eate anot eat nato inate eat anot tain eat",
  "nee ene ate ite tent tiet ent ine ene ete ene ate",
];
$(function () {
  $ucKB.hide();
  $endBtn.hide();
});

// Making keyboards change depending on shift key
let shiftPressed = false;
$(window)
  .keydown(function (e) {
    if (e.which == 16) {
      shiftPressed = true;
      $ucKB.show();
      $lcKB.hide();
    }
  })
  .keyup(function (e) {
    if (e.which == 16) {
      shiftPressed = false;
      $ucKB.hide();
      $lcKB.show();
    }
  });

// Making keys light up when pressed
$(document)
  .keypress(function (e) {
    $(`#${e.which}`).css("backgroundColor", "yellow");
  })
  .keyup(function (e) {
    $(`#${e.key.charCodeAt(0)}`).css("backgroundColor", "");
  });

//Displaying sentences in div, one at a time.
// There has to be a for loop going through the 'sentences' array,
// pulling a new index into the window after the previous index is completed

// Counting current letter
let letterMarker = 0;

// Setting up game variables
let $sentenceDiv = $("div#sentence");
let $highlighter = $("div#yellow-block");
let $feedback = $("div#feedback");
let $targetLetter = $("div#target-letter");

// Setting up game end scenarios
let end = 0;
let mistakes = 0;
let wordCount = 54;
// Setting up the game, where we move the yellow block through the sentences,
// then reset once a new sentence is loaded
let gameTime = function () {
  // Counting current sentence
  let sentenceMarker = 0;

  let mySentence = sentences[sentenceMarker];
  $sentenceDiv.append(mySentence);
  $targetLetter.append(mySentence.charAt(letterMarker));

  $(document).keypress(function (e) {
    let letterChecker = mySentence.charAt(letterMarker);
    let firstLetterLoader = mySentence.charAt(0);
    // Emptying target div
    $targetLetter.empty();
    // // Reloading with next letter
    // if (letterMarker >= mySentence.length - 1){
    //     $targetLetter.append(firstLetterLoader)
    // } else {
    //     $targetLetter.text(mySentence.charAt(letterMarker + 1));
    // }

    if (e.key === letterChecker) {
      let correct = $(
        '<span class="glyphicon glyphicon-ok-sign text-success">'
      );
      $feedback.append(correct);
    } else {
      let incorrect = $(
        '<span class="glyphicon glyphicon-remove-sign text-danger">'
      );
      mistakes++;
      $feedback.append(incorrect);
    }

    letterMarker++;

    // The Game:
    if (letterMarker == mySentence.length && sentenceMarker !== 5) {
      sentenceMarker++;
      $highlighter.css("left", "0");
      letterMarker = 0;
      $feedback.empty();
      // Checking for a game over condition every time the sentence counter is incrementing
      // Game Over Scenario:
      // Calculating words per minute with mistakes, displaying the final tally,
      // and then fading in restart button.
      if (sentenceMarker == sentences.length) {
        $feedback.empty();
        end = e.timeStamp;
        let timeDifference = end - 1;
        let seconds = timeDifference / 1000;
        let minutes = seconds / 60;
        let wordsPerMinute = (
          wordCount / minutes.toFixed(1) -
          2 * mistakes
        ).toFixed(3);

        if (`${wordsPerMinute}` < 0) {
          $feedback.append(
            '<h2 class="wpm">Too many mistakes! Please, try again!</h2>'
          );
        } else {
          $feedback.append(
            '<h2 class="wpm"> Words Per Minute: ' +
              `${wordsPerMinute}` +
              "</h2>"
          );
        }
        $endBtn.fadeIn(4000);
        $endBtn.click(function () {
          location.reload();
        });
      }
      // If the win condition isn't met, and the sentence counter has incremented, the next sentence loads
      mySentence = sentences[sentenceMarker];
      $sentenceDiv.empty();
      $sentenceDiv.text(mySentence);
      $targetLetter.append(mySentence.charAt(0));
      console.log(sentenceMarker);
    } else if (sentenceMarker < sentences.length) {
      // If the sentence marker is less than the length of the sentences array, and it's not being incremented,
      // then we just continue loading new letters into the target letter div.
      $targetLetter.text(mySentence.charAt(letterMarker));
      // But if the shift key is pressed, then the highlighter doesn't move.
      if (e.key == 16) {
        return false;
      } else {
        $highlighter.css("left", "+=17.2px");
      }
    }
  });
};

gameTime();
