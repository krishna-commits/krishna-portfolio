/**
 * Utility functions to get homepage data from config/site.tsx
 * This is used as a fallback when database is empty
 */

import { siteConfig } from 'config/site';

export function getHeroFromConfig() {
  return {
    profileImage: siteConfig.profile_image,
    name: siteConfig.name,
    bio: siteConfig.bio,
    title: siteConfig.home.title,
    description: siteConfig.home.description.trim(),
    talksAbout: siteConfig.talks_about.split(',').map((tag: string) => tag.trim()),
  };
}

export function getEducationFromConfig() {
  return siteConfig.education || [];
}

export function getWorkExperienceFromConfig() {
  return siteConfig.work_experience || [];
}

export function getCertificationsFromConfig() {
  return siteConfig.certification || [];
}

export function getRecommendationsFromConfig() {
  return siteConfig.linkedin_recommendations || [];
}

export function getTechnologyStackFromConfig() {
  return siteConfig.technology_stack || [];
}

export function getVolunteeringFromConfig() {
  return siteConfig.volunteering || [];
}

export function getSocialLinksFromConfig() {
  return siteConfig.links || {};
}

export function getPersonalNoteFromConfig() {
  // Personal note is hardcoded in the component, but we can extract a default
  // For now, return empty and let the component handle it
  return {
    content: '', // This would need to be extracted from the component
  };
}

export function getSecurityApproachFromConfig() {
  // Security approach is hardcoded in the component
  return {
    content: '', // This would need to be extracted from the component
  };
}

