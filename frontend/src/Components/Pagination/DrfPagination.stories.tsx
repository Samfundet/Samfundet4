import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import { DrfPagination } from './DrfPagination';

export default {
  title: 'Components/DRFPagination',
  component: DrfPagination,
  argTypes: {
    currentPage: {
      control: 'number',
      description: 'Current active page',
    },
    totalItems: {
      control: 'number',
      description: 'Total number of items to paginate',
    },
    pageSize: {
      control: 'number',
      description: 'Number of items per page',
    },
    className: {
      control: 'text',
      description: 'Custom class for the pagination container',
    },
    itemClassName: {
      control: 'text',
      description: 'Custom class for individual pagination items',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A pagination component designed to work with Django Rest Framework pagination.',
      },
    },
  },
} as ComponentMeta<typeof DrfPagination>;

// Template with state management
const Template: ComponentStory<typeof DrfPagination> = (args) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage);

  return <DrfPagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
};

// Basic usage
export const Basic = Template.bind({});
Basic.args = {
  currentPage: 1,
  totalItems: 100,
  pageSize: 10,
};
Basic.parameters = {
  docs: {
    description: {
      story: 'Basic pagination with default styling',
    },
  },
};

// Many pages example
export const ManyPages = Template.bind({});
ManyPages.args = {
  ...Basic.args,
  totalItems: 2500,
  currentPage: 7,
};
ManyPages.parameters = {
  docs: {
    description: {
      story: 'Pagination with many pages showing ellipsis',
    },
  },
};

// Minimal pages example
export const MinimalPages = Template.bind({});
MinimalPages.args = {
  ...Basic.args,
  totalItems: 30,
  pageSize: 10,
};

MinimalPages.parameters = {
  docs: {
    description: {
      story: 'Pagination with only a few pages using text theme',
    },
  },
};
