export class IApiResponse {
    response: string;
    success: IApiSuccess;
    failure: IApiFailure;
}


export class IApiSuccess {
    code: number;
    message: string;
    result: any;
}

export class IApiFailure {
    code: number;
    message: string;
    description: string;
    trace: string;
}

