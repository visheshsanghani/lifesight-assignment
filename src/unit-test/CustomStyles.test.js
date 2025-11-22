import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomStyles from '../components/CustomStyles';

describe('CustomStyles Component', () => {
  test('renders style tag', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    expect(styleTag).toBeInTheDocument();
  });

  test('contains CSS root variables', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    const styleContent = styleTag.textContent;
    
    expect(styleContent).toContain(':root');
    expect(styleContent).toContain('--color-primary');
    expect(styleContent).toContain('--color-secondary');
  });

  test('contains button styles', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    const styleContent = styleTag.textContent;
    
    expect(styleContent).toContain('.btn');
  });

  test('contains color variables', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    const styleContent = styleTag.textContent;
    
    expect(styleContent).toContain('--color-primary');
    expect(styleContent).toContain('--color-secondary');
    expect(styleContent).toContain('--color-success');
    expect(styleContent).toContain('--color-danger');
    expect(styleContent).toContain('--color-background');
  });

  test('contains shadow variables', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    const styleContent = styleTag.textContent;
    
    expect(styleContent).toContain('--shadow-base');
    expect(styleContent).toContain('--shadow-hover');
  });

  test('contains container styles', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    const styleContent = styleTag.textContent;
    
    expect(styleContent).toContain('.container');
  });

  test('contains body styles', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    const styleContent = styleTag.textContent;
    
    expect(styleContent).toContain('body');
  });

  test('renders only style tag without other visible elements', () => {
    const { container } = render(<CustomStyles />);
    // Style tag should be present but no other visible elements
    expect(container.querySelector('style')).toBeInTheDocument();
    expect(container.querySelector('div')).not.toBeInTheDocument();
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  test('style tag is the only child', () => {
    const { container } = render(<CustomStyles />);
    expect(container.children.length).toBe(1);
    expect(container.children[0].tagName).toBe('STYLE');
  });

  test('renders consistently on multiple renders', () => {
    const { container: container1 } = render(<CustomStyles />);
    const { container: container2 } = render(<CustomStyles />);
    
    const style1 = container1.querySelector('style').textContent;
    const style2 = container2.querySelector('style').textContent;
    
    expect(style1).toBe(style2);
  });

  test('contains font family variable', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    const styleContent = styleTag.textContent;
    
    expect(styleContent).toContain('--font-family');
  });

  test('style content is not empty', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    
    expect(styleTag.textContent.length).toBeGreaterThan(0);
  });

  test('contains input styles', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    const styleContent = styleTag.textContent;
    
    expect(styleContent).toContain('input');
  });

  test('contains dropdown styles', () => {
    const { container } = render(<CustomStyles />);
    const styleTag = container.querySelector('style');
    const styleContent = styleTag.textContent;
    
    expect(styleContent).toContain('dropdown');
  });
});
