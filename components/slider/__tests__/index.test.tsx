import React from 'react';
import Slider from '..';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { render, fireEvent, act } from '../../../tests/utils';
import ConfigProvider from '../../config-provider';
import SliderTooltip from '../SliderTooltip';
import type { TooltipProps } from '../../tooltip';
import { resetWarned } from '../../_util/warning';

function tooltipProps(): TooltipProps {
  return (global as any).tooltipProps;
}

jest.mock('../../tooltip', () => {
  const ReactReal = jest.requireActual('react');
  const Tooltip = jest.requireActual('../../tooltip');
  const TooltipComponent = Tooltip.default;
  return ReactReal.forwardRef((props: TooltipProps, ref: any) => {
    (global as any).tooltipProps = props;
    return <TooltipComponent {...props} ref={ref} />;
  });
});

describe('Slider', () => {
  mountTest(Slider);
  rtlTest(Slider);
  focusTest(Slider, { testLib: true });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should show tooltip when hovering slider handler', () => {
    const { container } = render(<Slider defaultValue={30} />);

    fireEvent.mouseEnter(container.querySelector('.ant-slider-handle')!);
    expect(document.querySelector('.ant-tooltip')).toMatchSnapshot();

    fireEvent.mouseLeave(container.querySelector('.ant-slider-handle')!);

    expect(document.querySelector('.ant-tooltip')).toMatchSnapshot();
  });

  it('should show correct placement tooltip when set tooltipPlacement', () => {
    const { container } = render(
      <Slider vertical defaultValue={30} tooltip={{ placement: 'left' }} />,
    );

    fireEvent.mouseEnter(container.querySelector('.ant-slider-handle')!);
    expect(tooltipProps().placement).toEqual('left');
  });

  it('when tooltip.open is true, tooltip should show always, or should never show', () => {
    const { container: container1 } = render(<Slider defaultValue={30} tooltip={{ open: true }} />);
    expect(
      container1.querySelector('.ant-tooltip-content')!.className.includes('ant-tooltip-hidden'),
    ).toBeFalsy();

    fireEvent.mouseEnter(container1.querySelector('.ant-slider-handle')!);
    expect(
      container1.querySelector('.ant-tooltip-content')!.className.includes('ant-tooltip-hidden'),
    ).toBeFalsy();

    fireEvent.click(container1.querySelector('.ant-slider-handle')!);
    expect(
      container1.querySelector('.ant-tooltip-content')!.className.includes('ant-tooltip-hidden'),
    ).toBeFalsy();

    const { container: container2 } = render(
      <Slider defaultValue={30} tooltip={{ open: false }} />,
    );
    expect(container2.querySelector('.ant-tooltip-content')!).toBeNull();
  });

  it('when step is null, thumb can only be slided to the specific mark', () => {
    const intentionallyWrongValue = 40;
    const marks = {
      0: '0',
      48: '48',
      100: '100',
    };

    const { container } = render(
      <Slider
        marks={marks}
        defaultValue={intentionallyWrongValue}
        step={null}
        tooltip={{ open: true }}
      />,
    );
    expect(container.querySelector('.ant-slider-handle')!.getAttribute('aria-valuenow')).toBe('48');
  });

  it('when step is not null, thumb can be slided to the multiples of step', () => {
    const marks = {
      0: '0',
      48: '48',
      100: '100',
    };

    const { container } = render(
      <Slider marks={marks} defaultValue={49} step={1} tooltip={{ open: true }} />,
    );
    expect(container.querySelector('.ant-slider-handle')!.getAttribute('aria-valuenow')).toBe('49');
  });

  it('when step is undefined, thumb can be slided to the multiples of step', () => {
    const marks = {
      0: '0',
      48: '48',
      100: '100',
    };

    const { container } = render(
      <Slider marks={marks} defaultValue={49} step={undefined} tooltip={{ open: true }} />,
    );
    expect(container.querySelector('.ant-slider-handle')!.getAttribute('aria-valuenow')).toBe('49');
  });

  it('should render in RTL direction', () => {
    const { container } = render(
      <ConfigProvider direction="rtl">
        <Slider defaultValue={30} tooltip={{ open: true }} />
      </ConfigProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should keepAlign by calling forcePopupAlign', async () => {
    let ref: any;
    render(
      <SliderTooltip
        title="30"
        open
        ref={node => {
          ref = node;
        }}
      />,
    );
    ref.forcePopupAlign = jest.fn();
    act(() => {
      jest.runAllTimers();
    });
    expect(ref.forcePopupAlign).toHaveBeenCalled();
  });

  it('tipFormatter should not crash with undefined value', () => {
    [undefined, null].forEach(value => {
      render(<Slider value={value as any} tooltip={{ open: true }} />);
    });
  });
  it('step should not crash with undefined value', () => {
    [undefined, null].forEach(value => {
      render(<Slider step={value} tooltip={{ open: true }} />);
    });
  });
  it('deprecated warning', () => {
    resetWarned();

    const TSSlider = Slider as any;

    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(<TSSlider tooltipPrefixCls="xxx" />);
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Slider] `tooltipPrefixCls` is removed in v5, please use `tooltip.prefixCls` instead.',
    );
    rerender(<TSSlider getTooltipPopupContainer={() => document.body} />);
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Slider] `getTooltipPopupContainer` is removed in v5, please use `tooltip.getPopupContainer` instead.',
    );
    rerender(<TSSlider tipFormatter={(v: any) => v} />);
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Slider] `tipFormatter` is removed in v5, please use `tooltip.formatter` instead.',
    );
    rerender(<TSSlider tooltipVisible />);
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Slider] `tooltipVisible` is removed in v5, please use `tooltip.open` instead.',
    );
    rerender(<TSSlider tooltipPlacement="left" />);
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Slider] `tooltipPlacement` is removed in v5, please use `tooltip.placement` instead.',
    );

    errSpy.mockRestore();
  });
});