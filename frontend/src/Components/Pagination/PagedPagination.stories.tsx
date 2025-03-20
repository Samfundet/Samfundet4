import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PagedPagination } from './PagedPagination';

const meta: Meta<typeof PagedPagination> = {
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
};

export default meta;

type Story = StoryObj<typeof PagedPagination>;

// Template with state management
const Template: Story = {
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);

    return (
      <div>
        <PagedPagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />
        <p>Current page: {currentPage}</p>
      </div>
    );
  },
};

// Basic usage
export const Basic: Story = {
  ...Template,
  args: {
    currentPage: 1,
    totalItems: 100,
    pageSize: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic pagination with default styling',
      },
    },
  },
};

// Many pages example
export const ManyPages: Story = {
  ...Template,
  args: {
    ...Basic.args,
    totalItems: 2500,
    currentPage: 7,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with many pages showing ellipsis',
      },
    },
  },
};

// Minimal pages example
export const MinimalPages: Story = {
  ...Template,
  args: {
    ...Basic.args,
    totalItems: 30,
    pageSize: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with only a few pages using text theme',
      },
    },
  },
};

// Example with increased sibling count
export const SiblingCountTwo: Story = {
  ...Template,
  args: {
    ...Basic.args,
    totalItems: 250,
    siblingCount: 2,
    currentPage: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination showing two sibling pages around the current page.',
      },
    },
  },
};

// Example with increased boundary count
export const BoundaryCountTwo: Story = {
  ...Template,
  args: {
    ...Basic.args,
    totalItems: 250,
    boundaryCount: 2,
    currentPage: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with two boundary pages displayed at the start and end.',
      },
    },
  },
};

// Combination of increased sibling and boundary count
export const SiblingAndBoundary: Story = {
  ...Template,
  args: {
    ...Basic.args,
    totalItems: 250,
    siblingCount: 2,
    boundaryCount: 2,
    currentPage: 12,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination showing two sibling pages and two boundary pages.',
      },
    },
  },
};
