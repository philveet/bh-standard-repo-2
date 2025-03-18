# CSS Architecture

This project uses a combination of global CSS variables and CSS Modules for styling.

## Global Styles

Global styles and CSS variables are defined in `src/app/globals.css`. This includes:

- Color palette (primary, secondary, success, error, warning)
- Text colors
- Background colors
- Spacing variables
- Typography settings
- Utility classes

## CSS Modules

Component-specific styles are defined in CSS Modules located in the `src/styles` directory:

- `page.module.css`: Styles for the main page layout
- `ApiStatus.module.css`: Styles for the API status component
- `AuthTesting.module.css`: Styles for the authentication testing component

## Usage Guidelines

1. **Use CSS variables for consistency**:
   ```css
   .myComponent {
     color: var(--color-text-primary);
     background-color: var(--color-bg-primary);
     padding: var(--spacing-md);
   }
   ```

2. **Create new components with CSS modules**:
   - Name the file as `ComponentName.module.css`
   - Import in your component: `import styles from '@/styles/ComponentName.module.css'`
   - Use in JSX: `<div className={styles.containerClass}>`

3. **For utility classes**:
   - Use the global utility classes defined in globals.css
   - Example: `<div className="container text-center">`

4. **Dark mode**:
   - Dark mode variables are automatically applied based on system preferences
   - Test components in both light and dark modes 