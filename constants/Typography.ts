import { TextStyle } from 'react-native';

const Typography = {
  // ─── Headings ───
  h1: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontSize: 18,
    fontWeight: '700',
  } as TextStyle,

  // ─── Body ───
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,

  bodyBold: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  } as TextStyle,

  // ─── Small / Captions ───
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,

  captionBold: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  } as TextStyle,

  // ─── Labels ───
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,

  // ─── Numbers ───
  metric: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  } as TextStyle,

  metricSmall: {
    fontSize: 20,
    fontWeight: '700',
  } as TextStyle,

  // ─── Buttons ───
  button: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  } as TextStyle,

  buttonSmall: {
    fontSize: 13,
    fontWeight: '600',
  } as TextStyle,

  // ─── Tab Bar ───
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  } as TextStyle,
};

export default Typography;
