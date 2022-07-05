import React, { useState } from 'react';
import { useBatchTool } from '../../context/toolProvider';

import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from 'react-papaparse';

import './index.css';

const GREY = '#CCC';
const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = '#686868';

const styles = {
  zone: {
    alignItems: 'center',
    borderColor: `${GREY}`,
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    padding: 20,
    marginBottom: '2rem',
  },
  file: {
    background: 'linear-gradient(to bottom, #EEE, #2f4f4f)',
    borderRadius: 20,
    display: 'flex',
    height: 120,
    width: 120,
    position: 'relative',
    zIndex: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  info: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
  },
  size: {
    borderRadius: 3,
    marginBottom: '0.5em',
    justifyContent: 'center',
    display: 'flex',
  },
  name: {
    borderRadius: 3,
    fontSize: 12,
    marginBottom: '0.5em',
  },
  progressBar: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  zoneHover: {
    borderColor: GREY_DIM,
  },
  default: {
    borderColor: GREY,
  },
  remove: {
    height: 23,
    position: 'absolute',
    right: 6,
    top: 10,
    width: 23,
  },
};

export default function CSVReader() {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  const { getCSVTokenIDs, removeCSVTokenIDs } = useBatchTool();

  return (
    <CSVReader
      onUploadAccepted={results => {
        getCSVTokenIDs(results.data);
        setZoneHover(false);
      }}
      onDragOver={event => {
        event.preventDefault();
        setZoneHover(true);
      }}
      onDragLeave={event => {
        event.preventDefault();
        setZoneHover(false);
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }) => (
        <>
          <div
            {...getRootProps()}
            style={Object.assign(
              {},
              styles.zone,
              zoneHover && styles.zoneHover
            )}
          >
            {acceptedFile ? (
              <>
                <div style={styles.file}>
                  <div style={styles.info}>
                    <span style={styles.size}>
                      {formatFileSize(acceptedFile.size)}
                    </span>
                    <span style={styles.name}>{acceptedFile.name}</span>
                  </div>
                  <div
                    {...getRemoveFileProps()}
                    style={styles.remove}
                    onMouseOver={event => {
                      event.preventDefault();
                      setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                    }}
                    onMouseOut={event => {
                      event.preventDefault();
                      setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                    }}
                  >
                    <label htmlFor="removeButton" onClick={removeCSVTokenIDs}>
                      <Remove color={removeHoverColor} />
                      <input
                        type="button"
                        id="removeButton"
                        className="removeButton"
                      />
                    </label>
                  </div>
                  <div style={styles.progressBar}>
                    <ProgressBar />
                  </div>
                </div>
              </>
            ) : (
              'Click to upload CSV TokenID File'
            )}
          </div>
        </>
      )}
    </CSVReader>
  );
}
