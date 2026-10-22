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

export const collections = { services, regions };
