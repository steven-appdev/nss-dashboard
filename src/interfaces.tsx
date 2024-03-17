import { ChartData, ChartDataset } from "chart.js";
import { StringMappingType } from "typescript";

interface IProvider {
   provider: string;
}

interface IQuestion {
   id: string;
   question: string;
}

interface IPositive {
   population: string;
   mode: string;
   level: string;
   results: IPositiveResult[];
}

interface IPositiveResult {
   qid: string;
   qtext: string;
   positivity: number;
   rank: number;
   rank_percentage: number;
}

interface IDataFilter {
   question?: string;
   level?: string;
   mode?: string;
   population?: string;
}

interface IQuartile {
    qid: string;
    qtext: string;
    positive: number;
    quartile: number;
    differences: IDifference[];
}

interface IDifference {
    label: string;
    data: number[];
    current: boolean;
}

export type { IProvider, IQuestion, IPositive, IPositiveResult, IDataFilter, IQuartile, IDifference };
