# Probability Lab

A static classroom app for exploring experimental probability with coin tosses, spinners, and dice.

## Activities

- Coin Toss: enter a number of tosses, run the tosses, switch between list, table, and ratio views, and clear results.
- Experimental Probability: use a preset four-color spinner where red, yellow, green, and blue each have theoretical relative frequency 0.25.
- Make Spinner: build a spinner with up to 12 slices and adjust each slice weight.
- Dice: roll either 1 die or 2 dice, use standard six-sided dice, or edit the six face labels.

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
