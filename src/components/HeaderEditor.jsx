import { useResume, useResumeDispatch } from '../hooks/useResumeStore';
import './HeaderEditor.css';

export default function HeaderEditor() {
  const resume = useResume();
  const dispatch = useResumeDispatch();
  const { header } = resume;

  const handleChange = (field, value) => {
    dispatch({ type: 'SET_HEADER_FIELD', field, value });
  };

  const handleAddLink = () => {
    dispatch({ type: 'ADD_LINK' });
  };

  const handleUpdateLink = (id, field, value) => {
    dispatch({ type: 'UPDATE_LINK', id, field, value });
  };

  const handleRemoveLink = (id) => {
    dispatch({ type: 'REMOVE_LINK', id });
  };

  return (
    <div className="header-editor" id="header-editor">
      {/* Name */}
      <div
        className="header-name"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleChange('name', e.currentTarget.textContent)}
        id="header-name"
      >
        {header.name}
      </div>

      {/* Job Title */}
      <div
        className="header-jobtitle"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleChange('jobTitle', e.currentTarget.textContent)}
        id="header-jobtitle"
      >
        {header.jobTitle}
      </div>

      {/* Contact Line */}
      <div className="header-contact-line">
        <span
          className="header-contact-item"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleChange('location', e.currentTarget.textContent)}
          id="header-location"
        >
          {header.location}
        </span>
        <span className="header-separator">|</span>
        <span
          className="header-contact-item header-contact-email"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleChange('email', e.currentTarget.textContent)}
          id="header-email"
        >
          {header.email}
        </span>
        <span className="header-separator">|</span>
        <span
          className="header-contact-item"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleChange('phone', e.currentTarget.textContent)}
          id="header-phone"
        >
          {header.phone}
        </span>

        {header.links.map((link) => (
          <span key={link.id} className="header-link-wrapper">
            <span className="header-separator">|</span>
            <span
              className="header-contact-item header-contact-link"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleUpdateLink(link.id, 'label', e.currentTarget.textContent)
              }
              title={`URL: ${link.url}`}
            >
              {link.label}
            </span>
            <button
              className="header-link-remove"
              onClick={() => handleRemoveLink(link.id)}
              title="Remover link"
              aria-label="Remover link"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Link URL Editor (only visible when links exist) */}
      {header.links.length > 0 && (
        <div className="header-links-urls no-print">
          {header.links.map((link) => (
            <div key={link.id} className="header-link-url-row">
              <span className="header-link-url-label">{link.label}:</span>
              <input
                className="header-link-url-input"
                type="url"
                value={link.url}
                onChange={(e) =>
                  handleUpdateLink(link.id, 'url', e.target.value)
                }
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Link Button */}
      <button
        className="header-add-link no-print"
        onClick={handleAddLink}
        id="btn-add-link"
      >
        + Adicionar Link
      </button>
    </div>
  );
}
