import styles from "./SkillTree.module.css";

export function LoadingState() {
  return (
    <div className={styles.container}>
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando árbol de logros...</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.error}>
        <p>❌ Error al cargar los datos</p>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className={styles.container}>
      <div className={styles.empty}>No hay logros para mostrar</div>
    </div>
  );
}
