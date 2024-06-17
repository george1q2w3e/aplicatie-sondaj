export interface CreateSurvey {
    name: string;
    description: string;
}

export interface AddQuestion {
    name: string;
    optional: boolean;
    type_: string;
    options_: string[];
}

export interface SurveyResponse {
    group: string;
    question_id: string;
    answer: string;
}

export interface AddSuggestion {
    name: string;
    description: string;
}
