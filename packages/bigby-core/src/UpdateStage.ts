export abstract class UpdateStage {}

export class EarlyUpdate extends UpdateStage {}
export class FixedUpdate extends UpdateStage {}
export class NormalUpdate extends UpdateStage {}
export class LateUpdate extends UpdateStage {}
export class RenderUpdate extends UpdateStage {}
