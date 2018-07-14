export interface MoamelehType {
    tarikhMoameleh?: Date,
    tedadSahm: number,
    arzeshSahm: number,
    forushandeh: {
        username: string,
        fullName: string,
        darkhastId: string
    },
    kharidar: {
        username: string,
        fullName: string,
        darkhastId: string
    },
    userIdSabtKonandeh?: string,
    usernameSabtKonandeh?: string,
    fullnameSabtKonandeh?: string
}