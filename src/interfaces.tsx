import { ChartData, ChartDataset } from "chart.js";
import { StringMappingType } from "typescript";

interface IProvider {
   provider: string;
}

interface IQuestion {
   id: string;
   question: string;
}

interface IYear {
   year: number;
}

interface ISubject {
   subject: string;
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
   tid: string;
   resp_count: number;
   positivity: number;
   rank: number;
   rank_percentage: number;
}

interface IDataFilter {
   qdrop?: string,
   popdrop?: string,
   modedrop?: string,
   leveldrop?: string,
   yeardrop?: string,
   subdrop?: string
}

interface IOption {
   option? : IDataFilter
   question? : string
   onClick?: (selectedQuestion: string) => void;
}

interface IQuartile {
   qid: string;
   qtext: string;
   resp_count: number;
   positive: number;
   quartile: number;
   differences: IDifference[];
}

interface IDifference {
   label: string;
   data: number[];
   abs_data: number[];
   colorCode: number;
   current: boolean;
}

interface IRespRate {
   qid: string;
   num_pop: number;
   resp_rate: number;
   detail: IDetail[];
}

interface IDetail {
   label: string;
   data: number;
   colorCode: number;
}

export type {
   IProvider,
   IQuestion,
   IYear,
   ISubject,
   IPositive,
   IPositiveResult,
   IDataFilter,
   IOption,
   IQuartile,
   IDifference,
   IRespRate
};
