<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>tints & shades</pre>
    </summary>
    <h2>Color shades and tints (10% graduation)</h2>
    <label
      >Base color:
      <input type="color" name="colorHexa" v-model="colorBase" />
    </label>
    <div class="demo-box" :style="`background-color: ${colorBase};`">
      {{ colorBase }}
    </div>
    <section>
      <h3>Shades of base color</h3>
      <article class="demo-box">
        <ul>
          <li v-for="(tint, index) in tints" :key="tint">
            <p
              class="color-box"
              :style="`background-color:#${tint}; border:1px solid #${shades[index]}`"
            >
              &nbsp;
            </p>
            <p>#{{ tint }}</p>
          </li>
        </ul>
        <div class="css-vars-wrapper">
          <textarea name="root-css-shades">{{
            cssRootVars(shades, "shade").join("\r")
          }}</textarea>
        </div>
      </article>
    </section>
    <section>
      <h3>Tints of base color</h3>
      <article class="demo-box">
        <ul>
          <li v-for="(shade, index) in shades" :key="shade">
            <p
              class="color-box"
              :style="`background-color:#${shade}; border:1px solid #${tints[index]}`"
            >
              &nbsp;
            </p>
            <p>#{{ shade }}</p>
          </li>
        </ul>
        <div class="css-vars-wrapper">
          <textarea name="root-css-shades">{{
            cssRootVars(tints, "tint").join("\r")
          }}</textarea>
        </div>
      </article>
    </section>
    <p>
      <i
        >Inspired by
        <a
          href="https://maketintsandshades.com/"
          target="_blank"
          rel="noopener noreferrer"
          >https://maketintsandshades.com/</a
        ></i
      >
    </p>
  </details>
</template>

<script setup lang="ts">
import { ref, computed, inject } from "vue";
import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);
const colorBase = ref("#3eaf7c");
const shades = computed(() => calculateShades(colorBase.value));
const tints = computed(() => calculateTints(colorBase.value));

const cssRootVars = (colors: string[], type: string) => {
  let filter = 0;

  const cssRootVars = colors.map((color) => {
    if (filter > 0) {
      const cssVar = `  --theme-color-${type}-${filter}: #${color};`;
      //console.log("cssRootVars > filter > 0", filter);

      filter += 10;
      return cssVar;
    }

    filter += 10;

    return `  --theme-color: #${color};`;
  });

  return cssRootVars;
};
// pad a hexadecimal string with zeros if it needs it
function pad(hexaStr: string, length: number) {
  let newHexaStr: string = "" + hexaStr;
  while (newHexaStr.length < length) {
    newHexaStr = "0" + newHexaStr;
  }
  return newHexaStr;
}

// convert a hex string into an object with red, green, blue numeric properties
// '501214' => { red: 80, green: 18, blue: 20 }
interface RgbColor {
  red: number;
  green: number;
  blue: number;
}
function hexToRGB(colorValue: string): RgbColor {
  const noHashColor = colorValue.replace("#", "");
  const redPart = noHashColor.substring(0, 2);
  const greenPart = noHashColor.substring(2, 4);
  const bluePart = noHashColor.substring(4, 6);
  console.log(
    "red hexa / green hexa / blue hexa",
    `${redPart} / ${greenPart} / ${bluePart}`
  );

  const rbgColorObj: RgbColor = {
    red: parseInt(redPart, 16),
    green: parseInt(greenPart, 16),
    blue: parseInt(bluePart, 16),
  };
  console.log("hexToRGB > rbgColorObj", rbgColorObj);

  return rbgColorObj;
}

// convert an integer to a 2-char hex string
// for sanity, round it and ensure it is between 0 and 255
// 43 => '2b'
function intToHex(rgbint: number) {
  console.log("Start intToHex...");

  const mathRoundResult = Math.round(rgbint);
  const mathMaxResult = Math.max(mathRoundResult, 0);
  const mathMinResult = Math.min(mathMaxResult, 255);
  const mathMinResultConvertion = mathMinResult.toString(16);
  const paddingResult = pad(mathMinResultConvertion, 2);
  console.log("result intToHex", {
    mathRoundResult,
    mathMaxResult,
    mathMinResult,
    mathMinResultConvertion,
    paddingResult,
  });
  return paddingResult;
  //original convertion...
  //return pad(Math.min(Math.max(Math.round(rgbint), 0), 255).toString(16), 2);
}

// convert one of our rgb color objects to a full hex color string
// { red: 80, green: 18, blue: 20 } => '501214'
function rgbToHex(rgb: RgbColor) {
  return intToHex(rgb.red) + intToHex(rgb.green) + intToHex(rgb.blue);
}

// shade one of our rgb color objects to a distance of i*10%
// ({ red: 80, green: 18, blue: 20 }, 1) => { red: 72, green: 16, blue: 18 }
function rgbShade(rgb: RgbColor, i: number) {
  return {
    red: rgb.red * (1 - 0.1 * i),
    green: rgb.green * (1 - 0.1 * i),
    blue: rgb.blue * (1 - 0.1 * i),
  };
}

// tint one of our rgb color objects to a distance of i*10%
// ({ red: 80, green: 18, blue: 20 }, 1) => { red: 98, green: 42, blue: 44 }
function rgbTint(rgb: RgbColor, i: number) {
  const tint = {
    red: rgb.red + (255 - rgb.red) * i * 0.1,
    green: rgb.green + (255 - rgb.green) * i * 0.1,
    blue: rgb.blue + (255 - rgb.blue) * i * 0.1,
  };
  console.log("tint", tint);

  return tint;
}

// take a hex color string and produce a list of 10 tints or shades of that color
// shadeOrTint should be either `rgbShade` or `rgbTint`, as defined above
// this allows us to use `calculate` for both shade and tint
function calculate(colorValue: string, shadeOrTint: Function) {
  console.log("calculate > colorValue", colorValue);

  const color: RgbColor = hexToRGB(colorValue);
  var shadeValues = [];

  for (let i = 0; i < 10; i++) {
    shadeValues[i] = rgbToHex(shadeOrTint(color, i));
  }
  return shadeValues;
}

// given a color value, return an array of ten shades in 10% increments
function calculateShades(colorValue: string) {
  return calculate(colorValue, rgbShade).concat("000000");
}

// given a color value, return an array of ten tints in 10% increments
function calculateTints(colorValue: string) {
  return calculate(colorValue, rgbTint).concat("ffffff");
}
</script>

<style scoped>
.demo-box {
  border: 1px solid;
  margin-top: 1em;
}

.demo-box ul {
  padding: 0;
  margin: 0;
  display: flex;
  list-style: none;
  max-width: inherit;
  flex-wrap: wrap;
}

.demo-box li {
  padding: 0 0.25em;
  margin: 0;
}

.demo-box li p {
  padding: 0;
  margin: 0;
}
.demo-box .css-vars-wrapper {
  width: 100%;
  margin: 0 auto;
  height: 10em;
}
.css-vars-wrapper textarea {
  margin-top: 1.25em;
  height: 15vh;
  width: 99.25%;
}

.color-box {
  height: 2em;
}
.slidecontainer {
  width: 100%;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: var(--theme-color);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #04aa6d;
  cursor: pointer;
}
</style>
