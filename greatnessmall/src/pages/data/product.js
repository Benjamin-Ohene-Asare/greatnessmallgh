import sunRiseImage from "../../assets/p3.webp";
import sunSetImage from "../../assets/p5.webp";
import colonGuardImage from "../../assets/p4.webp";
import alphaMaxVImage from "../../assets/p2-1114x1200.webp";
import alphaMaxMImage from "../../assets/p1.webp";
import alphaMaxCoffeeImage from "../../assets/p6.png";

export const categories = [
  "All",
  "Daily Wellness",
  "Digestive Wellness",
  "Men's Wellness",
  "Women's Wellness",
];

export const products = [
  {
    id: 1,
    slug: "sunrise",
    name: "SunRise",
    category: "Daily Wellness",
    shortDescription:
      "Daily wellness support for an active lifestyle.",

    description:
      "Discover more information about SunRise and how it can fit into your everyday wellness routine.",

    image: sunRiseImage,
  },

  {
    id: 2,
    slug: "sunset",
    name: "SunSet",
    category: "Daily Wellness",
    shortDescription:
      "Wellness support designed for your evening routine.",

    description:
      "Learn more about SunSet and the information available about this product.",

    image: sunSetImage,
  },

  {
    id: 3,
    slug: "colonguard",
    name: "ColonGuard",
    category: "Digestive Wellness",
    shortDescription:
      "A wellness product focused on digestive support.",

    description:
      "Explore more information about ColonGuard and its place within the Greatness Mall wellness range.",

    image: colonGuardImage,
  },

  {
    id: 4,
    slug: "alphamax-v-plus",
    name: "AlphaMax V+",
    category: "Men's Wellness",
    shortDescription:
      "A wellness option designed for men's everyday support.",

    description:
      "Find out more about AlphaMax V+ and the product information available from Greatness Mall.",

    image: alphaMaxVImage,
  },

  {
    id: 5,
    slug: "alphamax-m-plus-coffee",
    name: "AlphaMax M+ Coffee",
    category: "Men's Wellness",
    shortDescription:
      "Coffee-based wellness support for daily living.",

    description:
      "Learn more about AlphaMax M+ Coffee and its product information.",

    image: alphaMaxCoffeeImage,
  },

  {
    id: 6,
    slug: "alphamax-m-plus",
    name: "AlphaMax M+",
    category: "Men's Wellness",
    shortDescription:
      "A wellness product created for men's lifestyle support.",

    description:
      "Explore AlphaMax M+ and learn more about this product.",

    image: alphaMaxMImage,
  },
];