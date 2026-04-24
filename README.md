# Probability Lab

A static classroom app for exploring experimental probability with coin tosses, spinners, dice, and poem word sampling.

## Activities

- Coin Toss: enter a number of tosses, run the tosses, keep the main view focused on heads, tails, and total tosses, and open list, table, or ratio details when needed.
- Experimental Probability: choose from multiple preset spinners, including a four-color spinner where red, yellow, green, and blue each have relative frequency 0.25.
- Make Spinner: split a spinner into equal fractions such as 1/4 or 1/8, use ROYGB plus purple and pink, and adjust each slice weight.
- Dice: roll either 1 die or 2 dice, use the same preset and custom trial counts as the spinners, or edit the six face labels.
- Results: switch between count and relative frequency, with relative frequencies shown only as fractions and theoretical probability hidden by default.
- Poem Word Generator: pick random words from Paul Laurence Dunbar's "Sympathy" using the 186-word classroom copy, with the poem PDF linked in the app.
- Paper Pennies (Lesson 13): pull random penny ages from the lesson's Paper Pennies population, reveal each pull with a paper-bag animation, and build a dot plot after 10 pulls (up to 75 shown).
- Cube Bag (Lesson 2): run a random colored-cube pull experiment with editable color toggles/counts, configurable bag total, and replacement mode (default on).

## Run Locally

Open `index.html` in a browser, or serve the folder with:

```sh
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Inspiration

This project recreates similar classroom probability experiments to the Interactivate activities:

- [Coin Toss](https://appstate-math.github.io/interactivate/activities/Coin/)
- [Experimental Probability](https://appstate-math.github.io/interactivate/activities/ExpProbability/)

The implementation is original, dependency-free HTML, CSS, and JavaScript.
