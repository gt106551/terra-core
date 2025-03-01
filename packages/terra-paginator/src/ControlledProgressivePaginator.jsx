import React from 'react';
import PropTypes from 'prop-types';
import classNamesBind from 'classnames/bind';
import ThemeContext from 'terra-theme-context';
import { injectIntl } from 'react-intl';
import ResponsiveElement from 'terra-responsive-element';
import VisuallyHiddenText from 'terra-visually-hidden-text';
import * as KeyCode from 'keycode-js';
import styles from './Paginator.module.scss';
import { calculatePages } from './_paginationUtils';
import PaginatorButton from './_PaginatorButton';
import getPageLabel from './PageLabel';

const cx = classNamesBind.bind(styles);

const propTypes = {
  /**
   * Function to be executed when a navigation element is selected.
   */
  onPageChange: PropTypes.func.isRequired,
  /**
   * The active/selected page.
   */
  selectedPage: PropTypes.number.isRequired,
  /**
   * Total number of all items being paginated.
   */
  totalCount: PropTypes.number,
  /**
   * Total number of items per page.
   */
  itemCountPerPage: PropTypes.number,
  /**
   * @private
   * The intl object to be injected for translations.
   */
  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
  /**
   * Allows user to set custom page label. _(usage note: User must pass translated text)_.
   */
  pageLabel: PropTypes.string,
};

class ControlledProgressivePaginator extends React.Component {
  constructor(props) {
    super(props);

    this.handlePageChange = this.handlePageChange.bind(this);
    this.defaultProgressivePaginator = this.defaultProgressivePaginator.bind(this);
    this.reducedProgressivePaginator = this.reducedProgressivePaginator.bind(this);
    this.setPaginator = this.setPaginator.bind(this);
    this.state = {
      showReducedPaginator: false,
    };
  }

  handlePageChange(index) {
    return (event) => {
      if (event.nativeEvent.keyCode === KeyCode.KEY_RETURN || event.nativeEvent.keyCode === KeyCode.KEY_SPACE) {
        event.preventDefault();
      }

      this.props.onPageChange(index);
    };
  }

  setPaginator(value) {
    const showReducedPaginator = value === 'tiny';
    if (this.state.showReducedPaginator !== showReducedPaginator) {
      this.setState({ showReducedPaginator });
    }
  }

  defaultProgressivePaginator() {
    const theme = this.context;
    const {
      selectedPage,
      intl,
      totalCount,
      itemCountPerPage,
      pageLabel,
    } = this.props;
    const totalPages = (totalCount) ? calculatePages(totalCount, itemCountPerPage) : 0;
    const previousPageIndex = selectedPage === 1 ? 1 : selectedPage - 1;
    const nextPageIndex = selectedPage === totalPages ? totalPages : selectedPage + 1;

    const { messageId, messageAttributes } = getPageLabel(pageLabel, selectedPage, totalPages);

    return (
      <div className={cx('paginator', 'progressive', theme.className)} role="navigation" aria-label="pagination">
        <div>
          {
            intl.formatMessage({ id: messageId }, messageAttributes)
          }
        </div>
        <div>
          {
            totalCount && (
              <PaginatorButton
                ariaDisabled={selectedPage === 1}
                ariaLabel={intl.formatMessage({ id: 'Terra.paginator.first' })}
                className={cx(['nav-link', selectedPage === 1 ? 'is-disabled' : null])}
                disabled={selectedPage === 1}
                onClick={this.handlePageChange(1)}
                onKeyDown={this.handlePageChange(1)}
              >
                {intl.formatMessage({ id: 'Terra.paginator.first' })}
              </PaginatorButton>
            )
          }
          <PaginatorButton
            ariaDisabled={selectedPage === 1}
            ariaLabel={intl.formatMessage({ id: 'Terra.paginator.previous' })}
            className={cx(['nav-link', 'previous', selectedPage === 1 ? 'is-disabled' : null])}
            disabled={selectedPage === 1}
            onClick={this.handlePageChange(previousPageIndex)}
            onKeyDown={this.handlePageChange(previousPageIndex)}
          >
            <span className={cx('icon')} />
            {intl.formatMessage({ id: 'Terra.paginator.previous' })}
          </PaginatorButton>
          <PaginatorButton
            ariaDisabled={selectedPage === totalPages}
            ariaLabel={intl.formatMessage({ id: 'Terra.paginator.next' })}
            className={cx(['nav-link', 'next', selectedPage === totalPages ? 'is-disabled' : null])}
            disabled={selectedPage === totalPages}
            onClick={this.handlePageChange(nextPageIndex)}
            onKeyDown={this.handlePageChange(nextPageIndex)}
          >
            {intl.formatMessage({ id: 'Terra.paginator.next' })}
            <span className={cx('icon')} />
          </PaginatorButton>
          {
            (totalCount) && (
              <PaginatorButton
                ariaDisabled={selectedPage === totalPages}
                ariaLabel={intl.formatMessage({ id: 'Terra.paginator.last' })}
                className={cx(['nav-link', selectedPage === totalPages ? 'is-disabled' : null])}
                disabled={selectedPage === totalPages}
                onClick={this.handlePageChange(totalPages)}
                onKeyDown={this.handlePageChange(totalPages)}
              >
                {intl.formatMessage({ id: 'Terra.paginator.last' })}
              </PaginatorButton>
            )
          }
        </div>
      </div>
    );
  }

  reducedProgressivePaginator() {
    const theme = this.context;
    const {
      selectedPage,
      intl,
      totalCount,
      itemCountPerPage,
      pageLabel,
    } = this.props;
    const totalPages = (totalCount) ? calculatePages(totalCount, itemCountPerPage) : 0;
    const previousPageIndex = selectedPage === 1 ? 1 : selectedPage - 1;
    const nextPageIndex = selectedPage === totalPages ? totalPages : selectedPage + 1;

    const { messageId, messageAttributes } = getPageLabel(pageLabel, selectedPage, totalPages);

    return (
      <div className={cx('paginator', theme.className)} role="navigation" aria-label="pagination">
        <div>
          {
            (totalCount) && (
              <PaginatorButton
                ariaDisabled={selectedPage === 1}
                ariaLabel={intl.formatMessage({ id: 'Terra.paginator.first' })}
                className={cx(['nav-link', selectedPage === 1 ? 'is-disabled' : null])}
                disabled={selectedPage === 1}
                onClick={this.handlePageChange(1)}
                onKeyDown={this.handlePageChange(1)}
              >
                {intl.formatMessage({ id: 'Terra.paginator.first' })}
              </PaginatorButton>
            )
          }
          <PaginatorButton
            ariaDisabled={selectedPage === 1}
            ariaLabel={intl.formatMessage({ id: 'Terra.paginator.previous' })}
            className={cx(['nav-link', 'previous', 'icon-only', selectedPage === 1 ? 'is-disabled' : null])}
            disabled={selectedPage === 1}
            onClick={this.handlePageChange(previousPageIndex)}
            onKeyDown={this.handlePageChange(previousPageIndex)}
          >
            <VisuallyHiddenText text={intl.formatMessage({ id: 'Terra.paginator.previous' })} />
            <span className={cx('icon')} />
          </PaginatorButton>
        </div>
        <div>
          {
            intl.formatMessage({ id: messageId }, messageAttributes)
          }
        </div>
        <div>
          <PaginatorButton
            ariaDisabled={selectedPage === totalPages}
            ariaLabel={intl.formatMessage({ id: 'Terra.paginator.next' })}
            className={cx(['nav-link', 'next', 'icon-only', selectedPage === totalPages ? 'is-disabled' : null])}
            disabled={selectedPage === totalPages}
            onClick={this.handlePageChange(nextPageIndex)}
            onKeyDown={this.handlePageChange(nextPageIndex)}
          >
            <VisuallyHiddenText text={intl.formatMessage({ id: 'Terra.paginator.next' })} />
            <span className={cx('icon')} />
          </PaginatorButton>
          {
            (totalCount) && (
              <PaginatorButton
                ariaDisabled={selectedPage === totalPages}
                ariaLabel={intl.formatMessage({ id: 'Terra.paginator.last' })}
                className={cx(['nav-link', selectedPage === totalPages ? 'is-disabled' : null])}
                disabled={selectedPage === totalPages}
                onClick={this.handlePageChange(totalPages)}
                onKeyDown={this.handlePageChange(totalPages)}
              >
                {intl.formatMessage({ id: 'Terra.paginator.last' })}
              </PaginatorButton>
            )
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <ResponsiveElement
        onChange={this.setPaginator}
      >
        { this.state.showReducedPaginator ? this.reducedProgressivePaginator() : this.defaultProgressivePaginator()}
      </ResponsiveElement>
    );
  }
}

ControlledProgressivePaginator.propTypes = propTypes;
ControlledProgressivePaginator.contextType = ThemeContext;

export default injectIntl(ControlledProgressivePaginator);
