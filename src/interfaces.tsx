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
    percentage: number[]
}

export type{
    IProvider, IQuestion, IPositive
}