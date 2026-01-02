import React from 'react';
import styles from './ProjectMetadata.module.css';

interface ProjectMetadataProps {
  duration?: string;
  role?: string;
  publication?: string;
}

export default function ProjectMetadata({
  duration,
  role,
  publication,
}: ProjectMetadataProps): React.ReactElement | null {
  if (!duration && !role && !publication) {
    return null;
  }

  return (
    <div className={styles.metadata}>
      {duration && (
        <div className={styles.metadataItem}>
          <em>Duration: {duration}</em>
        </div>
      )}
      {role && (
        <div className={styles.metadataItem}>
          <em>Role: {role}</em>
        </div>
      )}
      {publication && (
        <div className={styles.metadataItem}>
          <em>Publication: {publication}</em>
        </div>
      )}
    </div>
  );
}
