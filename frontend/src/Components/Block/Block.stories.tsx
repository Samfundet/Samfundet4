import type { Meta, StoryObj } from '@storybook/react';
import {
  BlockContainer,
  BlockTitle,
  Block,
  BlockContent,
  BlockHeader,
  BlockFooter,
  BlockImage,
  type BlockTheme,
} from './Block';

type BlockStoryArgs = {
  theme: BlockTheme;
  showHeader: boolean;
  headerText: string;
  headerGradient: boolean;
  showImage: boolean;
  imageSrc: string;
  disableZoomEffect: boolean;
  titleText: string;
  contentText: string;
  showFooter: boolean;
  footerLeftText: string;
  footerRightText: string;
  footerGradient: boolean;
};

export default {
  title: 'Components/Block',
  component: Block,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['red', 'purple', 'green', 'blue', 'gold'],
      description: 'Color theme of the block',
    },
    showHeader: {
      control: 'boolean',
      description: 'Show header section',
    },
    headerText: {
      control: 'text',
      description: 'Header text content',
      if: { arg: 'showHeader' },
    },
    headerGradient: {
      control: 'boolean',
      description: 'Add gradient effect to header',
      if: { arg: 'showHeader' },
    },
    showImage: {
      control: 'boolean',
      description: 'Show image',
    },
    imageSrc: {
      control: 'text',
      description: 'Image URL',
      if: { arg: 'showImage' },
    },
    disableZoomEffect: {
      control: 'boolean',
      description: 'Disable image zoom effect on hover',
      if: { arg: 'showImage' },
    },
    titleText: {
      control: 'text',
      description: 'Title text content',
    },
    contentText: {
      control: 'text',
      description: 'Body text content',
    },
    showFooter: {
      control: 'boolean',
      description: 'Show footer section',
    },
    footerLeftText: {
      control: 'text',
      description: 'Footer left text',
      if: { arg: 'showFooter' },
    },
    footerRightText: {
      control: 'text',
      description: 'Footer right text',
      if: { arg: 'showFooter' },
    },
    footerGradient: {
      control: 'boolean',
      description: 'Add gradient effect to footer',
      if: { arg: 'showFooter' },
    },
  },
} satisfies Meta<BlockStoryArgs>;

type Story = StoryObj<BlockStoryArgs>;

export const Playground: Story = {
  args: {
    theme: 'red',
    showHeader: false,
    headerText: 'NYHET',
    headerGradient: false,
    showImage: false,
    imageSrc: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
    disableZoomEffect: false,
    titleText: 'Samfundet\nhar\nopptak!',
    contentText: '',
    showFooter: true,
    footerLeftText: 'Frist i dag',
    footerRightText: 'Les mer →',
    footerGradient: false,
  },
  render: (args: BlockStoryArgs) => (
    <BlockContainer>
      <Block theme={args.theme as BlockTheme}>
        {args.showHeader && (
          <BlockHeader gradient={args.headerGradient}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {args.headerText}
            </span>
          </BlockHeader>
        )}
        {args.showImage && (
          <BlockImage
            src={args.imageSrc}
            alt="Block image"
            disableZoomEffect={args.disableZoomEffect}
          />
        )}
        <BlockContent>
          <BlockTitle style={{ whiteSpace: 'pre-line' }}>
            {args.titleText}
          </BlockTitle>
          {args.contentText && <p>{args.contentText}</p>}
        </BlockContent>
        {args.showFooter && (
          <BlockFooter
            gradient={args.footerGradient}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            <div>{args.footerLeftText}</div>
            <span style={{ color: 'inherit' }}>{args.footerRightText}</span>
          </BlockFooter>
        )}
      </Block>
    </BlockContainer>
  ),
};
