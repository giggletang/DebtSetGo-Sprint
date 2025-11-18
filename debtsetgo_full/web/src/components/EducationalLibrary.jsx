import { useEffect, useState } from "react";
import { getLibraryTopics, getLibraryArticle } from "../api";

export default function EducationalLibrary() {
  const [topics, setTopics] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [article, setArticle] = useState(null);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [error, setError] = useState("");

  // 加载文章列表
  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await getLibraryTopics();
        setTopics(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load educational topics.");
      } finally {
        setLoadingTopics(false);
      }
    }
    loadTopics();
  }, []);

  // 选择某一篇文章时加载内容
  useEffect(() => {
    if (!selectedId) return;
    setLoadingArticle(true);
    setArticle(null);
    setError("");
    async function loadArticle() {
      try {
        const data = await getLibraryArticle(selectedId);
        setArticle(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load this guide.");
      } finally {
        setLoadingArticle(false);
      }
    }
    loadArticle();
  }, [selectedId]);

  return (
    <div className="library-layout">
      <div className="library-sidebar">
        <h3>Guides</h3>
        {loadingTopics && <p>Loading topics...</p>}
        {!loadingTopics && topics.length === 0 && <p>No guides yet.</p>}

        <ul className="library-topic-list">
          {topics.map((t) => (
            <li
              key={t.id}
              className={
                "library-topic-item" + (t.id === selectedId ? " active" : "")
              }
              onClick={() => setSelectedId(t.id)}
            >
              <div className="library-topic-title">{t.title}</div>
              <div className="library-topic-meta">
                <span className="badge">{t.level}</span>
                {t.tags && t.tags.length > 0 && (
                  <span className="library-topic-tags">
                    {t.tags.join(" · ")}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="library-content">
        <h2>Educational Library</h2>
        <p className="section-subtitle">
          Simple guides to help you understand credit, saving, budgeting, and investing as a student.
        </p>

        {loadingArticle && <p>Loading guide...</p>}
        {error && <p className="error-message">{error}</p>}

        {article && (
          <div className="library-article">
            <h3>{article.title}</h3>
            <p className="library-article-meta">
              Level: <strong>{article.level}</strong>
            </p>
            <pre className="library-article-body">
              {article.content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
