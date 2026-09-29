import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import type { ImageDto } from '~/dto';
import { ImageTile } from './ImageTile';

function mockImage(id: number, title: string, src: string, tags: string[] = []): ImageDto {
  return {
    id,
    title,
    urls: { original: src, large: src, medium: src, small: src },
    tags: tags.map((name, index) => ({ id: index, name, color: '' })),
  };
}

const IMAGES: ImageDto[] = [
  mockImage(
    2,
    'Fotogjengen',
    'https://samfundet.no/assets/groups/fotogjengen-f109febff76fe01fe48e632ef91a7c04d8d67537909e2f6e64e0219e0a77efa7.jpg',
    ['foto', 'arrangement'],
  ),
  mockImage(
    3,
    'Under Dusken',
    'https://samfundet.no/assets/groups/under%20dusken-5997cbd6fc91858b135e4910d92436849fcd0bd57fae961f6fc4814b5cd015e6.jpg',
  ),
];

const LONG_IMAGE = mockImage(
  4,
  'Akademisk Radioklubb holder åpent hus med lang tittel som må kuttes etter to linjer',
  'https://samfundet.no/assets/groups/akademisk%20radioklubb-cd2ce61eb1a6ce273fc3eb492c7a1a05255024e892dbad151c7ecc671d0a6df1.jpg',
  ['radio', 'åpent hus', 'arrangement', 'en veldig lang tag som skal kuttes', 'ekstra'],
);

const meta: Meta<typeof ImageTile> = {
  title: 'Components/ImageTile',
  component: ImageTile,
  args: {
    image: IMAGES[0],
  },
  decorators: [
    // ImageTile has no intrinsic size, it fills whatever box the parent gives it.
    (Story, { parameters }) =>
      parameters.customLayout ? (
        <Story />
      ) : (
        <div style={{ width: '15rem', aspectRatio: '1 / 1.08', display: 'grid' }}>
          <Story />
        </div>
      ),
  ],
};

export default meta;

type Story = StoryObj<typeof ImageTile>;

/** No url or onClick: plain div, no hover lift or pointer cursor. */
export const DisplayOnly: Story = {};

/** With url: renders a link, as used on the image admin page. */
export const AsLink: Story = {
  args: {
    url: '/control-panel/images/1/',
  },
};

/** With onClick: renders a button, as used in ImagePicker. */
export const AsButton: Story = {
  args: {
    onClick: fn(),
  },
};

export const Selected: Story = {
  args: {
    onClick: fn(),
    selected: true,
  },
};

export const LongTitleAndManyTags: Story = {
  args: {
    image: LONG_IMAGE,
    onClick: fn(),
  },
};

/** Image fails to load: shows the fallback background. */
export const MissingImage: Story = {
  args: {
    image: mockImage(5, 'Bilde mangler', 'https://invalid.example/missing.jpg', ['placeholder']),
  },
};

/** Click to select, like ImagePicker. Tab through to check the focus ring. */
export const SelectableGrid: Story = {
  parameters: { customLayout: true },
  render: function Render() {
    const [selectedId, setSelectedId] = useState<number>();
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 11rem)', gap: '0.9rem' }}>
        {[...IMAGES, LONG_IMAGE].map((image) => (
          <div key={image.id} style={{ aspectRatio: '1 / 1.08', display: 'grid' }}>
            <ImageTile image={image} selected={selectedId === image.id} onClick={() => setSelectedId(image.id)} />
          </div>
        ))}
      </div>
    );
  },
};
