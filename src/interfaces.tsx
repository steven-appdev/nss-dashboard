import { StringMappingType } from "typescript";

interface IProvider{
    provider: string;
}

interface IQuestion{
    id: string,
    question: string;
}

interface IPositive{
    population: string,
    mode: string,
    level: string,
    results: IPositiveResult[]
}

interface IPositiveResult{
    qid: string
    qtext: string
    positivity: number,
    rank: number,
    rank_percentage: number
}

export type{
    IProvider, IQuestion, IPositive, IPositiveResult
}