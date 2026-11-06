import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Diensten — worden zowel als kaart op de homepage getoond
// als op hun eigen route (/{slug}) gerenderd.
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    icon: z.enum([
      'cable',
      'building',
      'roof',
      'wall',
      'trowel',
      'shield',
    ]),
    order: z.number(),
    image: z.object({
      label: z.string(),
      ratio: z.enum(['4:3', '3:4', '16:9', '1:1']),
      src: z.string().optional(),
    }),
  }),
});

// Regio's — worden in de footer gelinkt en krijgen later
// eigen landingspagina's voor lokale SEO.
const regions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/regions' }),
  schema: z.object({
    name: z.string(),
    shortDescription: z.string().optional(),
    order: z.number(),
  }),
});

// Adviesartikels (/advies/{slug}): uitleg over regels en premies, enkel op
// basis van officiële bronnen. `gecontroleerd` = datum waarop alle feiten
// opnieuw tegen de bronnen zijn nagekeken (zichtbaar + dateModified).
const artikels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artikels' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    gepubliceerd: z.coerce.date(),
    gecontroleerd: z.coerce.date(),
    diensten: z.array(z.string()).default([]),
    bronnen: z.array(z.object({ titel: z.string(), url: z.url() })).min(1),
  }),
});

export const collections = { services, regions, artikels };
