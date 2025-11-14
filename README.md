# Range Component

A customizable dual-range slider component built with React and Next.js. This component allows users to select a range of values using two draggable thumbs, with support for both continuous ranges and predefined value sets.

## Features

- **Dual Thumb Range Slider**: Select a range of values with two draggable thumbs
- **Editable Labels**: Directly edit the min and max values by clicking on them
- **Customizable**: Set min/max bounds, initial values, and units
- **Discrete Values**: Supports both continuous ranges and predefined value sets
- **Responsive Design**: Works on different screen sizes
- **TypeScript Support**: Fully typed with TypeScript

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Component Props

The `DualRange` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| min | number | 0 | Minimum value of the range |
| max | number | 100 | Maximum value of the range |
| values | number[] | undefined | Optional array of discrete values |
| initialMin | number | 30 | Initial minimum value |
| initialMax | number | 70 | Initial maximum value |
| unit | string | "$" | Unit to display with values (e.g., "$", "€", "%") |
| onChange | (min: number, max: number) => void | undefined | Callback when values change |

## Usage Example

```tsx
import { DualRange } from './components/Range';

function App() {
  const handleRangeChange = (min: number, max: number) => {
    console.log(`Selected range: ${min} - ${max}`);
  };

  return (
    <div>
      <DualRange 
        min={0}
        max={1000}
        initialMin={300}
        initialMax={700}
        unit="$"
        onChange={handleRangeChange}
      />
    </div>
  );
}
```

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

## Deployment

This project can be deployed on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) or any other platform that supports Next.js applications.

## License

MIT
