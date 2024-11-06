import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import { PagedPagination } from './DrfPagination';

export default {
  title: 'Components/DRFPagination',
  component: PagedPagination,
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
    siblingCount: {
      control: 'number',
      description: 'Number of sibling pages around the current page',
      defaultValue: 1,
    },
    boundaryCount: {
      control: 'number',
      description: 'Number of pages to display at the start and end',
      defaultValue: 1,
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
} as ComponentMeta<typeof PagedPagination>;

// Template with state management
const Template: ComponentStory<typeof PagedPagination> = (args) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage);

  return (
    <div>
      <PagedPagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />
      <p>Current page: {currentPage}</p>
    </div>
  );
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

// Example with increased sibling count
export const SiblingCountTwo = Template.bind({});
SiblingCountTwo.args = {
  ...Basic.args,
  totalItems: 250,
  siblingCount: 2,
  currentPage: 5,
};
SiblingCountTwo.parameters = {
  docs: {
    description: {
      story: 'Pagination showing two sibling pages around the current page.',
    },
  },
};

// Example with increased boundary count
export const BoundaryCountTwo = Template.bind({});
BoundaryCountTwo.args = {
  ...Basic.args,
  totalItems: 250,
  boundaryCount: 2,
  currentPage: 10,
};
BoundaryCountTwo.parameters = {
  docs: {
    description: {
      story: 'Pagination with two boundary pages displayed at the start and end.',
    },
  },
};

// Combination of increased sibling and boundary count
export const SiblingAndBoundary = Template.bind({});
SiblingAndBoundary.args = {
  ...Basic.args,
  totalItems: 250,
  siblingCount: 2,
  boundaryCount: 2,
  currentPage: 12,
};
SiblingAndBoundary.parameters = {
  docs: {
    description: {
      story: 'Pagination showing two sibling pages and two boundary pages.',
    },
  },
};
