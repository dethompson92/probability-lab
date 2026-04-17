# Probability Lab

A static classroom app for exploring experimental probability with coin tosses, spinners, and dice.

## Activities

- Coin Toss: enter a number of tosses, run the tosses, switch between list, table, and ratio views, and clear results.
- Experimental Probability: choose from multiple preset spinners, including a four-color spinner where red, yellow, green, and blue each have relative frequency 0.25.
- Make Spinner: split a spinner into equal fractions such as 1/4 or 1/8, use ROYGB plus purple and pink, and adjust each slice weight.
- Dice: roll either 1 die or 2 dice, use the same preset and custom trial counts as the spinners, or edit the six face labels.
- Results: switch between count and relative frequency, with relative frequencies shown only as fractions and theoretical probability hidden by default.

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
