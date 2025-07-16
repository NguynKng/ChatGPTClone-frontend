export interface Message {
    id: string;
    conversationId: string;
    isUserMessage: boolean;
    content: string;
    createdAt: string;
}