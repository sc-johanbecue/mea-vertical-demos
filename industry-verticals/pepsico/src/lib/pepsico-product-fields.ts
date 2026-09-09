import type { ImageField, LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';

/** Walkers / Lays brand red */
export const PEPSICO_BRAND_RED = '#e31e24';

/** Shared datasource fields for product card + product detail */
export interface PepsiCoProductFields {
  Image: ImageField;
  /** Product line / range label (e.g. OVEN BAKED) — product detail header line 1 */
  Category: TextField;
  Title: TextField;
  Cta: LinkField;
  Ingredients: RichTextField;
  AllergyAdvice: RichTextField;
  AdditionalInfo: RichTextField;
  Table1: RichTextField;
  Table2: RichTextField;
}

const defaultTable1 = `<table>
<thead><tr><th></th><th>Grams</th><th>% of RI*</th></tr></thead>
<tbody>
<tr><td>Calories</td><td>128</td><td>6%*</td></tr>
<tr><td>Fat</td><td>3.8 g</td><td>5%*</td></tr>
<tr><td>Saturates</td><td>0.4 g</td><td>2%*</td></tr>
<tr><td>Sugars</td><td>2.1 g</td><td>2%*</td></tr>
<tr><td>Salt</td><td>0.22 g</td><td>4%*</td></tr>
</tbody>
</table>
<p>Energy per 100g: 1798kJ 427kcal</p>`;

const defaultTable2 = `<table>
<thead><tr><th></th><th>Per 30g (%*) Serving</th><th>Per 100g</th></tr></thead>
<tbody>
<tr><td>Energy</td><td>539kJ (6%*)</td><td>1798kJ</td></tr>
<tr><td>Calories</td><td>128 (6%*)</td><td>427</td></tr>
<tr><td>Fat</td><td>3.8 g (5%*)</td><td>13 g</td></tr>
<tr><td>of which Saturates</td><td>0.4 g (2%*)</td><td>1.3 g</td></tr>
<tr><td>Carbohydrate</td><td>19 g</td><td>64 g</td></tr>
<tr><td>of which Sugars</td><td>2.1 g (2%*)</td><td>7.0 g</td></tr>
<tr><td>Fibre</td><td>1.2 g</td><td>4.0 g</td></tr>
<tr><td>Protein</td><td>1.6 g</td><td>5.3 g</td></tr>
<tr><td>Salt</td><td>0.22 g (4%*)</td><td>0.75 g</td></tr>
</tbody>
</table>
<p>This pack contains 5 servings.</p>
<p>* Reference intake of an average adult (8400 kJ/2000 kcal)</p>`;

export const defaultPepsiCoProductFields: PepsiCoProductFields = {
  Image: { value: { src: '', alt: 'Walkers Oven Baked Slow Roasted Beef' } },
  Category: { value: 'OVEN BAKED' },
  Title: { value: 'SLOW ROASTED BEEF' },
  Cta: { value: { href: '#', text: 'View product' } },
  Ingredients: {
    value: `<p>Potato Flakes, Starch, Rapeseed Oil, Slow Roasted Beef Flavour [Hydrolysed Vegetable Protein (Corn), Sugar, Dextrose, Onion Powder, Flavouring, Carob Flour, Garlic Powder, Salt, Acid (Citric Acid), Black Pepper Powder, Smoked Maltodextrin, Colour (Paprika Extract)], Sugar, Emulsifier (Lecithins), Sunflower Oil, Colour (Annatto Norbixin)</p>`,
  },
  AllergyAdvice: {
    value: '<p>May contain: Mustard, Milk, Soya, Wheat and other cereals containing gluten</p>',
  },
  AdditionalInfo: {
    value:
      '<ul><li>Suitable for vegetarian</li><li>50% less fat than regular potato crisps</li></ul>',
  },
  Table1: { value: defaultTable1 },
  Table2: { value: defaultTable2 },
};
