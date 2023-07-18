import {} from 'jasmine';
import { Subscription } from 'rxjs';

import {
  registerModelConfig,
  unregisterModelConfig,
} from 'fittable-core/model';
import {
  registerOperationConfig,
  unregisterOperationConfig,
} from 'fittable-core/operations';
import {
  createScrollContainer,
  createScrollContainerListener,
  registerViewModelConfig,
  ScrollContainer,
  ScrollContainerListener,
  unregisterViewModelConfig,
  FitHtmlDivElement,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';

import { FIT_VIEW_MODEL_CONFIG } from '../../dist/index.js';

describe('fit-scroll-container-listener.ts', (): void => {
  const subscriptions: Set<Subscription> = new Set();

  beforeAll((): void => {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
  });
  afterAll(() => {
    unregisterModelConfig();
    unregisterOperationConfig();
    unregisterViewModelConfig();
    subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  });

  it('scroll down', (): void => {
    const scrollContainer: ScrollContainer = createScrollContainer();
    let scroll = false;
    subscriptions.add(
      scrollContainer.onAfterRenderModel$().subscribe((): void => {
        scroll = true;
      })
    );
    const div: FitHtmlDivElement = new (class implements FitHtmlDivElement {
      clientHeight = 100;
      clientWidth = 50;
      scrollLeft = 0;
      scrollTop = 0;
      scrollTo(left: number, top: number): void {
        this.scrollLeft = left;
        this.scrollTop = top;
      }
      parentElement = null;
      tagName = 'div';
      getAttribute(name: string): string | null {
        throw new Error('Method not implemented.');
      }
    })();
    const scrollContainerListener: ScrollContainerListener =
      createScrollContainerListener(div, scrollContainer);
    scrollContainerListener.onScroll();

    expect(scroll).toBeTrue();
  });
});
