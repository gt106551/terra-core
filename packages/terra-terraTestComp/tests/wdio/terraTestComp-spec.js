Terra.describeViewports('TerraTestComp', ['tiny', 'medium', 'large'], () => {
  describe('Default', () => {
    before(() => browser.url('/raw/tests/terra-terraTestComp/terraTestComp/default-terraTestComp'));

    it('validates the element', () => {
      Terra.validates.element();
    });
  });
});
