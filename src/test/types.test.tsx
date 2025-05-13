import { describe, it, expect } from "vitest";

import { Doc } from "../../convex/_generated/dataModel";

const types = {
            "image/png": "png",
            'image/jpeg': "jpg",
            "application/pdf": "pdf",
            "text/plain": "txt",
            "text/csv": "csv",
        } as Record<string, Doc<"files">["type"]>

describe('type', () => {
    it('Should return correct file types for all file extensions', () => {
        const test1 = types["image/png"]
        const test2= types["image/jpeg"]
        const test3= types["application/pdf"]
        const test4= types["text/plain"]
        const test5= types["text/csv"]
        expect(test1).toBe("png")
        expect(test2).toBe("jpg")
        expect(test3).toBe("pdf")
        expect(test4).toBe("txt")
        expect(test5).toBe("csv")
        return(test1)
    })
})



