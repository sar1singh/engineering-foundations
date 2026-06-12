import { describe, it, expect } from "vitest";
import { OfferReadinessService } from "./founder-beta-offer-readiness-service";
import type { OfferReadinessInput } from "@/types/founder-beta";

const service = new OfferReadinessService();

const strongInput: OfferReadinessInput = {
  capabilityReadinessById: {
    "cap-system-design-hld": 80,
    "cap-aws-cloud-architecture": 78,
    "cap-behavioral-communication": 75,
    "cap-dsa-problem-solving": 70,
    "cap-career-assets": 85
  },
  proofCompletionByCapabilityId: {
    "cap-system-design-hld": 5,
    "cap-aws-cloud-architecture": 5,
    "cap-behavioral-communication": 3,
    "cap-dsa-problem-solving": 4,
    "cap-career-assets": 3,
    "cap-architecture-case-studies": 3,
    "cap-node-backend": 3,
    "cap-distributed-systems": 2,
    "cap-databases": 2,
    "cap-security": 2,
    "cap-reliability-observability": 2,
    "cap-low-level-design": 2,
    "cap-delivery-leadership": 1,
    "cap-technical-leadership": 1
  },
  completedCaseStudyCount: 3,
  resumeReadiness: 85,
  linkedinReadiness: 75,
  githubReadiness: 65,
  portfolioReadiness: 65,
  behavioralReadiness: 72,
  interviewReadiness: 70,
  technicalReadiness: 75,
  leadershipReadiness: 70,
  communicationReadiness: 70,
  architectureReadiness: 72,
  projectDepthReadiness: 68,
  applicationReadiness: 50,
  referralReadiness: 40,
  compensationReadiness: 50,
  completedTopicIds: []
};

describe("OfferReadinessService", () => {
  describe("calculate", () => {
    it("returns a complete result", () => {
      const result = service.calculate(strongInput);
      expect(typeof result.overallScore).toBe("number");
      expect(typeof result.overallBand).toBe("string");
      expect(result.areas).toHaveLength(15);
      expect(typeof result.hardGatesPassed).toBe("boolean");
      expect(Array.isArray(result.blockingGaps)).toBe(true);
      expect(Array.isArray(result.recommendedActions)).toBe(true);
    });

    it("produces deterministic results", () => {
      const a = service.calculate(strongInput);
      const b = service.calculate(strongInput);
      expect(a.overallScore).toBe(b.overallScore);
      expect(a.overallBand).toBe(b.overallBand);
    });
  });

  describe("bands", () => {
    it("returns not-started for 0", () => expect(service.getBand(0)).toBe("not-started"));
    it("returns blocked for < 50", () => expect(service.getBand(25)).toBe("blocked"));
    it("returns in-progress for 50-74", () => expect(service.getBand(65)).toBe("in-progress"));
    it("returns ready for 75-89", () => expect(service.getBand(85)).toBe("ready"));
    it("returns strong for 90+", () => expect(service.getBand(95)).toBe("strong"));
  });

  describe("hard gates", () => {
    it("passes all hard gates with strong input", () => {
      const result = service.calculate(strongInput);
      expect(result.hardGatesPassed).toBe(true);
    });

    it("fails hard gates with low architect readiness", () => {
      const lowInput: OfferReadinessInput = {
        ...strongInput,
        capabilityReadinessById: {
          ...strongInput.capabilityReadinessById,
          "cap-system-design-hld": 30,
          "cap-aws-cloud-architecture": 30
        }
      };
      const result = service.calculate(lowInput);
      expect(result.hardGatesPassed).toBe(false);
      expect(result.overallBand).toBe("blocked");
    });

    it("fails hard gates with low resume readiness", () => {
      const lowInput: OfferReadinessInput = {
        ...strongInput,
        resumeReadiness: 30
      };
      const result = service.calculate(lowInput);
      expect(result.hardGatesPassed).toBe(false);
      expect(result.overallBand).toBe("blocked");
    });
  });

  describe("blocking gaps", () => {
    it("returns gaps for low areas", () => {
      const lowInput: OfferReadinessInput = {
        ...strongInput,
        resumeReadiness: 30,
        behavioralReadiness: 30,
        capabilityReadinessById: {
          ...strongInput.capabilityReadinessById,
          "cap-behavioral-communication": 30
        }
      };
      const result = service.calculate(lowInput);
      expect(result.blockingGaps.length).toBeGreaterThan(0);
      expect(result.recommendedActions.length).toBeGreaterThan(0);
    });
  });

  describe("DSA weakness impact", () => {
    it("flags DSA weakness in interview gaps", () => {
      const lowDsaInput: OfferReadinessInput = {
        ...strongInput,
        capabilityReadinessById: {
          ...strongInput.capabilityReadinessById,
          "cap-dsa-problem-solving": 30
        }
      };
      const result = service.calculate(lowDsaInput);
      const interviewArea = result.areas.find((a) => a.area === "interview");
      expect(interviewArea?.blockingGaps.some((g) => g.includes("DSA"))).toBe(true);
    });

    it("does not flag DSA when DSA readiness is adequate", () => {
      const result = service.calculate(strongInput);
      const interviewArea = result.areas.find((a) => a.area === "interview");
      const dsaGaps = interviewArea?.blockingGaps.filter((g) => g.includes("DSA")) ?? [];
      expect(dsaGaps.length).toBe(0);
    });
  });

  describe("recommended actions", () => {
    it("recommends completing hard gates when they fail", () => {
      const lowInput: OfferReadinessInput = {
        ...strongInput,
        resumeReadiness: 20
      };
      const result = service.calculate(lowInput);
      expect(result.recommendedActions.some((a) => a.toLowerCase().includes("hard gate"))).toBe(true);
    });

    it("returns satisfactory message when all areas are good", () => {
      const goodInput: OfferReadinessInput = {
        ...strongInput,
        resumeReadiness: 90,
        linkedinReadiness: 85,
        githubReadiness: 80,
        portfolioReadiness: 80,
        behavioralReadiness: 85,
        interviewReadiness: 85,
        technicalReadiness: 85,
        leadershipReadiness: 80,
        communicationReadiness: 80,
        architectureReadiness: 85,
        projectDepthReadiness: 80,
        applicationReadiness: 80,
        referralReadiness: 75,
        compensationReadiness: 75,
        capabilityReadinessById: {
          "cap-system-design-hld": 90,
          "cap-aws-cloud-architecture": 88,
          "cap-behavioral-communication": 85,
          "cap-dsa-problem-solving": 80,
          "cap-career-assets": 90
        }
      };
      const result = service.calculate(goodInput);
      expect(result.recommendedActions.some((a) => a.includes("satisfactory"))).toBe(true);
    });

    it("recommends building weak areas", () => {
      const weakInput: OfferReadinessInput = {
        ...strongInput,
        resumeReadiness: 30,
        linkedinReadiness: 25
      };
      const result = service.calculate(weakInput);
      const buildActions = result.recommendedActions.filter((a) => a.startsWith("Build"));
      expect(buildActions.length).toBeGreaterThan(0);
    });
  });

  describe("expanded readiness areas", () => {
    it("includes all 15 readiness areas in the result", () => {
      const result = service.calculate(strongInput);
      const areaNames = result.areas.map((a) => a.area);
      expect(areaNames).toContain("technical");
      expect(areaNames).toContain("leadership");
      expect(areaNames).toContain("communication");
      expect(areaNames).toContain("architecture");
      expect(areaNames).toContain("project-depth");
    });

    it("flags low technical readiness", () => {
      const lowInput: OfferReadinessInput = {
        ...strongInput,
        technicalReadiness: 30
      };
      const result = service.calculate(lowInput);
      const techArea = result.areas.find((a) => a.area === "technical");
      expect(techArea?.band).toBe("blocked");
      expect(techArea?.blockingGaps.length).toBeGreaterThan(0);
    });

    it("flags low leadership readiness", () => {
      const lowInput: OfferReadinessInput = {
        ...strongInput,
        leadershipReadiness: 25
      };
      const result = service.calculate(lowInput);
      const leadArea = result.areas.find((a) => a.area === "leadership");
      expect(leadArea?.band).toBe("blocked");
    });

    it("flags low architecture readiness", () => {
      const lowInput: OfferReadinessInput = {
        ...strongInput,
        architectureReadiness: 30
      };
      const result = service.calculate(lowInput);
      const archArea = result.areas.find((a) => a.area === "architecture");
      expect(archArea?.band).toBe("blocked");
    });

    it("flags low project depth readiness", () => {
      const lowInput: OfferReadinessInput = {
        ...strongInput,
        projectDepthReadiness: 30
      };
      const result = service.calculate(lowInput);
      const pdArea = result.areas.find((a) => a.area === "project-depth");
      expect(pdArea?.band).toBe("blocked");
    });
  });

  describe("score calculation", () => {
    it("returns overall score between 0 and 100", () => {
      const result = service.calculate(strongInput);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    it("returns overall score of 0 with all-zero input", () => {
      const zeroInput: OfferReadinessInput = {
        capabilityReadinessById: {},
        proofCompletionByCapabilityId: {},
        completedCaseStudyCount: 0,
        resumeReadiness: 0,
        linkedinReadiness: 0,
        githubReadiness: 0,
        portfolioReadiness: 0,
        behavioralReadiness: 0,
        interviewReadiness: 0,
        technicalReadiness: 0,
        leadershipReadiness: 0,
        communicationReadiness: 0,
        architectureReadiness: 0,
        projectDepthReadiness: 0,
        applicationReadiness: 0,
        referralReadiness: 0,
        compensationReadiness: 0,
        completedTopicIds: []
      };
      const result = service.calculate(zeroInput);
      expect(result.overallScore).toBe(0);
    });
  });
});
