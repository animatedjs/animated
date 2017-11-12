import ApplyAnimatedValues from './ApplyAnimatedValues';
import InteractionManager from './InteractionManager';
import FlattenStyle from './FlattenStyle';
import RequestAnimationFrame from './RequestAnimationFrame';
import CancelAnimationFrame from './CancelAnimationFrame';

export default {
  ApplyAnimatedValues: ApplyAnimatedValues.inject,
  InteractionManager: InteractionManager.inject,
  FlattenStyle: FlattenStyle.inject,
  RequestAnimationFrame: RequestAnimationFrame.inject,
  CancelAnimationFrame: CancelAnimationFrame.inject,
};
