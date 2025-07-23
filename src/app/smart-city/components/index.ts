// types/index.ts
// export * from './models';
// export * from './viewmodels';
// export * from './components';
// export * from './common';

// types/common.ts
export type Position3D = [number, number, number];
export type Rotation3D = [number, number, number];
export type Color = string;

export interface Observable<T> {
    subscribe(callback: (data: T) => void): void;
    unsubscribe(callback: (data: T) => void): void;
    notify(): void;
}

// types/models.ts
export interface ITrafficLightModel {
    currentState: number;
    states: string[];
    timings: number[];
    getCurrentState(): string;
    getStateColor(): Record<string, { active: string; inactive: string }>;
    nextState(): void;
}

export interface IBuildingModel {
    id: string;
    position: Position3D;
    height: number;
    width: number;
    depth: number;
    type: BuildingType;
    hasBalconies: boolean;
    isHovered: boolean;
    floors: number;
    getTypeProperties(): BuildingTypeProperties;
    setHovered(hovered: boolean): void;
}

export interface IVehicleModel {
    id: string;
    position: Position3D;
    rotation: Rotation3D;
    color: Color;
    speed: number;
    route: 'horizontal' | 'vertical';
    updatePosition(time: number): void;
}

export interface ICityMetricsModel {
    metrics: CityMetrics;
    time: Date;
    updateTime(): void;
    getMetric(key: string): MetricData;
    getAllMetrics(): CityMetrics;
}

export type BuildingType = 'office' | 'residential' | 'mixed' | 'hotel';

export interface BuildingTypeProperties {
    color: string;
    windowColor: string;
    roofColor: string;
}

export interface MetricData {
    status: string;
    color: string;
}

export interface CityMetrics {
    trafficFlow: MetricData;
    transit: MetricData;
    powerGrid: MetricData;
    airQuality: MetricData;
    population: MetricData;
}

// types/viewmodels.ts
export interface ITrafficLightViewModel extends Observable<ITrafficLightModel> {
    model: ITrafficLightModel;
    startCycle(): void;
    getCurrentState(): string;
    getStateColors(): Record<string, { active: string; inactive: string }>;
}

export interface ICityViewModel extends Observable<any> {
    buildings: IBuildingModel[];
    vehicles: IVehicleModel[];
    trafficLights: TrafficLightConfig[];
    cityMetrics: ICityMetricsModel;
    updateBuildingHover(buildingId: string, isHovered: boolean): void;
    updateVehiclePositions(time: number): void;
    updateCityMetrics(): void;
    getBuildingById(id: string): IBuildingModel | undefined;
    getAllBuildings(): IBuildingModel[];
    getAllVehicles(): IVehicleModel[];
    getTrafficLights(): TrafficLightConfig[];
    getCityMetrics(): ICityMetricsModel;
}

export interface TrafficLightConfig {
    position: Position3D;
    viewModel: ITrafficLightViewModel;
}

// types/components.ts
export interface BuildingViewProps {
    building: IBuildingModel;
}

export interface VehicleViewProps {
    vehicle: IVehicleModel;
}

export interface TrafficLightViewProps {
    position: Position3D;
    viewModel: ITrafficLightViewModel;
}

export interface CityProviderProps {
    children: React.ReactNode;
}

export interface BuildingConfig {
    id?: string;
    position: Position3D;
    height?: number;
    width?: number;
    depth?: number;
    type?: BuildingType;
    hasBalconies?: boolean;
}

export interface VehicleConfig {
    id?: string;
    position: Position3D;
    color?: Color;
    speed?: number;
    route?: 'horizontal' | 'vertical';
}