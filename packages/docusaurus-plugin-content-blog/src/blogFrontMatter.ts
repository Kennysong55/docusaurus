/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  JoiFrontMatter as Joi, // Custom instance for front matter
  URISchema,
  validateFrontMatter,
  FrontMatterTagsSchema,
  FrontMatterTOCHeadingLevels,
} from '@docusaurus/utils-validation';
import type {BlogPostFrontMatter} from '@docusaurus/plugin-content-blog';

const BlogPostFrontMatterAuthorSchema = Joi.object({
  key: Joi.string(),
  name: Joi.string(),
  title: Joi.string(),
  url: URISchema,
  imageURL: Joi.string(),
})
  .or('key', 'name', 'imageURL')
  .rename('image_url', 'imageURL', {alias: true});

const FrontMatterAuthorErrorMessage =
  '{{#label}} does not look like a valid blog post author. Please use an author key or an author object (with a key and/or name).';

const BlogFrontMatterSchema = Joi.object<BlogPostFrontMatter>({
  id: Joi.string(),
  title: Joi.string().allow(''),
  description: Joi.string().allow(''),
  tags: FrontMatterTagsSchema,
  draft: Joi.boolean(),
  date: Joi.date().raw(),

  // New multi-authors front matter:
  authors: Joi.alternatives()
    .try(
      Joi.string(),
      BlogPostFrontMatterAuthorSchema,
      Joi.array()
        .items(Joi.string(), BlogPostFrontMatterAuthorSchema)
        .messages({
          'array.sparse': FrontMatterAuthorErrorMessage,
          'array.includes': FrontMatterAuthorErrorMessage,
        }),
    )
    .messages({
      'alternatives.match': FrontMatterAuthorErrorMessage,
    }),
  // Legacy author front matter
  author: Joi.string(),
  author_title: Joi.string(),
  author_url: URISchema,
  author_image_url: URISchema,
  // TODO enable deprecation warnings later
  authorURL: URISchema,
  // .warning('deprecate.error', { alternative: '"author_url"'}),
  authorTitle: Joi.string(),
  // .warning('deprecate.error', { alternative: '"author_title"'}),
  authorImageURL: URISchema,
  // .warning('deprecate.error', { alternative: '"author_image_url"'}),

  slug: Joi.string(),
  image: URISchema,
  keywords: Joi.array().items(Joi.string().required()),
  hide_table_of_contents: Joi.boolean(),

  ...FrontMatterTOCHeadingLevels,
}).messages({
  'deprecate.error':
    '{#label} blog frontMatter field is deprecated. Please use {#alternative} instead.',
});

export function validateBlogPostFrontMatter(
  frontMatter: Record<string, unknown>,
): BlogPostFrontMatter {
  return validateFrontMatter(frontMatter, BlogFrontMatterSchema);
}
