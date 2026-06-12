import { founderBetaReadinessRules } from "@/data/founder-beta/readiness-rules";
import type {
  OfferReadinessArea,
  OfferReadinessAreaDetail,
  OfferReadinessInput,
  OfferReadinessResult,
  ReadinessBand
} from "@/types/founder-beta";

const AREA_ORDER: OfferReadinessArea[] = [
  "resume", "linkedin", "github", "portfolio",
  "behavioral", "interview", "architecture-case-studies",
  "technical", "leadership", "communication", "architecture", "project-depth",
  "applications", "referrals", "compensation"
];

const HARD_GATE_MAP: Record<string, OfferReadinessArea> = {
  "rule-architect-readiness": "interview",
  "rule-aws-readiness": "interview",
  "rule-behavioral-readiness": "behavioral",
  "rule-communication-readiness": "behavioral",
  "rule-resume-readiness": "resume",
  "rule-architecture-case-studies": "architecture-case-studies"
};

export class OfferReadinessService {
  calculate(input: OfferReadinessInput): OfferReadinessResult {
    const areas = this.computeAreas(input);
    const hgPassed = this.checkHardGates(input);
    const overallScore = this.computeOverall(areas, input);
    const blockingGaps = this.findBlockingGaps(areas, input, hgPassed);
    const actions = this.recommendActions(areas, blockingGaps, hgPassed);

    return {
      overallScore,
      overallBand: hgPassed ? this.getBand(overallScore) : "blocked",
      areas,
      hardGatesPassed: hgPassed,
      blockingGaps,
      recommendedActions: actions
    };
  }

  private computeAreas(input: OfferReadinessInput): OfferReadinessAreaDetail[] {
    const areaValues: Record<OfferReadinessArea, { score: number; gaps: string[] }> = {
      resume: {
        score: input.resumeReadiness,
        gaps: input.resumeReadiness < 80 ? ["Resume positioning needs stronger architect/lead impact bullets"] : []
      },
      linkedin: {
        score: input.linkedinReadiness,
        gaps: input.linkedinReadiness < 70 ? ["LinkedIn profile needs architect positioning and consistent narrative"] : []
      },
      github: {
        score: input.githubReadiness,
        gaps: input.githubReadiness < 60 ? ["GitHub needs proof-of-work projects and professional READMEs"] : []
      },
      portfolio: {
        score: input.portfolioReadiness,
        gaps: input.portfolioReadiness < 60 ? ["Portfolio needs case study packaging and architecture artifacts"] : []
      },
      behavioral: {
        score: input.behavioralReadiness,
        gaps: input.behavioralReadiness < 70 ? ["Behavioral stories need STAR structure and follow-up readiness"] : []
      },
      interview: {
        score: input.interviewReadiness,
        gaps: this.getInterviewGaps(input)
      },
      "architecture-case-studies": {
        score: Math.min(100, (input.completedCaseStudyCount / 3) * 100),
        gaps: input.completedCaseStudyCount < 3 ? [`Need ${3 - input.completedCaseStudyCount} more completed case studies`] : []
      },
      technical: {
        score: input.technicalReadiness,
        gaps: input.technicalReadiness < 70 ? ["Technical depth needs reinforcement — focus on distributed systems, DSA, and cloud patterns"] : []
      },
      leadership: {
        score: input.leadershipReadiness,
        gaps: input.leadershipReadiness < 60 ? ["Leadership stories need concrete examples of influence, mentorship, and org-wide impact"] : []
      },
      communication: {
        score: input.communicationReadiness,
        gaps: input.communicationReadiness < 60 ? ["Communication readiness needs improvement — practice written proposals and verbal presentation"] : []
      },
      architecture: {
        score: input.architectureReadiness,
        gaps: input.architectureReadiness < 65 ? ["Architecture readiness needs trade-off articulation, design patterns, and scalability reasoning"] : []
      },
      "project-depth": {
        score: input.projectDepthReadiness,
        gaps: input.projectDepthReadiness < 60 ? ["Project depth needs stronger domain context and measurable impact narratives"] : []
      },
      applications: {
        score: input.applicationReadiness,
        gaps: input.applicationReadiness < 60 ? ["Application pipeline needs target company list and resume variants"] : []
      },
      referrals: {
        score: input.referralReadiness,
        gaps: []
      },
      compensation: {
        score: input.compensationReadiness,
        gaps: input.compensationReadiness < 60 ? ["Compensation strategy needs floor/target/stretch with market evidence"] : []
      }
    };

    return AREA_ORDER.map((area) => {
      const info = areaValues[area];
      return {
        area,
        score: this.clamp(info.score),
        band: this.getBand(info.score),
        blockingGaps: info.gaps
      };
    });
  }

  private getInterviewGaps(input: OfferReadinessInput): string[] {
    const gaps: string[] = [];
    const dsaReadiness = input.capabilityReadinessById["cap-dsa-problem-solving"] ?? 0;
    const awsReadiness = input.capabilityReadinessById["cap-aws-cloud-architecture"] ?? 0;
    const hldReadiness = input.capabilityReadinessById["cap-system-design-hld"] ?? 0;
    const archReadiness = (hldReadiness + awsReadiness) / 2;

    if (dsaReadiness < 60) gaps.push("DSA readiness is low — coding interview performance may be weak");
    if (awsReadiness < 65) gaps.push("AWS readiness is below the 70 threshold for architect interviews");
    if (hldReadiness < 65) gaps.push("HLD readiness needs improvement for system design rounds");
    if (archReadiness < 70) gaps.push("Overall architect readiness is below interview threshold");
    if (input.technicalReadiness < 60) gaps.push("Technical readiness is low — strengthen distributed systems and core CS fundamentals");

    return gaps;
  }

  private checkHardGates(input: OfferReadinessInput): boolean {
    for (const rule of founderBetaReadinessRules) {
      const actual = this.getGateActual(rule.id, input);
      if (actual < rule.threshold) return false;
    }
    return true;
  }

  private getGateActual(ruleId: string, input: OfferReadinessInput): number {
    switch (ruleId) {
      case "rule-architect-readiness": {
        const hld = input.capabilityReadinessById["cap-system-design-hld"] ?? 0;
        const aws = input.capabilityReadinessById["cap-aws-cloud-architecture"] ?? 0;
        return Math.round((hld + aws) / 2);
      }
      case "rule-aws-readiness":
        return input.capabilityReadinessById["cap-aws-cloud-architecture"] ?? 0;
      case "rule-behavioral-readiness":
        return input.behavioralReadiness;
      case "rule-communication-readiness":
        return Math.round((
          (input.capabilityReadinessById["cap-behavioral-communication"] ?? 0) +
          input.behavioralReadiness
        ) / 2);
      case "rule-resume-readiness":
        return input.resumeReadiness;
      case "rule-architecture-case-studies":
        return input.completedCaseStudyCount;
      default:
        return 0;
    }
  }

  private computeOverall(areas: OfferReadinessAreaDetail[], input: OfferReadinessInput): number {
    const weights: Record<OfferReadinessArea, number> = {
      resume: 12,
      linkedin: 4,
      github: 4,
      portfolio: 8,
      behavioral: 12,
      interview: 16,
      "architecture-case-studies": 12,
      technical: 10,
      leadership: 8,
      communication: 6,
      architecture: 10,
      "project-depth": 8,
      applications: 4,
      referrals: 4,
      compensation: 4
    };

    const totalWeight = areas.reduce((sum, a) => sum + weights[a.area], 0);
    if (totalWeight === 0) return 0;

    const weighted = areas.reduce((sum, a) => sum + a.score * weights[a.area], 0);
    return this.clamp(weighted / totalWeight);
  }

  private findBlockingGaps(areas: OfferReadinessAreaDetail[], input: OfferReadinessInput, hgPassed: boolean): string[] {
    const gaps: string[] = [];

    if (!hgPassed) {
      for (const rule of founderBetaReadinessRules) {
        const actual = this.getGateActual(rule.id, input);
        if (actual < rule.threshold) {
          const area = HARD_GATE_MAP[rule.id];
          const areaDetail = areas.find((a) => a.area === area);
          if (areaDetail && areaDetail.blockingGaps.length > 0) {
            gaps.push(...areaDetail.blockingGaps);
          } else {
            gaps.push(`${rule.label} is below threshold (${actual}/${rule.threshold})`);
          }
        }
      }
    }

    areas.forEach((a) => {
      if (a.score >= 50 && a.score < 75) {
        gaps.push(...a.blockingGaps);
      }
    });

    return [...new Set(gaps)].slice(0, 5);
  }

  private recommendActions(areas: OfferReadinessAreaDetail[], blockingGaps: string[], hgPassed: boolean): string[] {
    const actions: string[] = [];

    if (!hgPassed) {
      actions.push("Complete hard gate requirements before pursuing applications");
    }

    for (const area of areas) {
      if (area.band === "blocked" || area.band === "not-started") {
        actions.push(...area.blockingGaps.map((g) => `Address: ${g}`));
      }
    }

    const weak = areas.filter((a) => a.score > 0 && a.score < 50);
    for (const a of weak) {
      actions.push(`Build ${a.area} readiness (currently ${a.score}/100)`);
    }

    if (actions.length === 0) {
      actions.push("All readiness areas are satisfactory for offer readiness");
    }

    return actions.slice(0, 5);
  }

  getBand(score: number): ReadinessBand {
    const s = this.clamp(score);
    if (s === 0) return "not-started";
    if (s < 50) return "blocked";
    if (s < 75) return "in-progress";
    if (s < 90) return "ready";
    return "strong";
  }

  private clamp(v: number): number {
    if (!Number.isFinite(v)) return 0;
    return Math.max(0, Math.min(100, Math.round(v)));
  }
}

export const founderBetaOfferReadinessService = new OfferReadinessService();
