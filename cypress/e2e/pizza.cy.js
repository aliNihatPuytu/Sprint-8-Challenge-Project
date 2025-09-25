describe('Teknolojik Yemekler Pizza Sipariş Testleri', () => {
  const BASE_URL = Cypress.config('baseUrl') || 'http://localhost:5173';
  

  const testData = {
    validName: 'Ahmet Yılmaz',
    shortName: 'Ah',
    pizzaSize: 'Orta',
    doughType: 'Normal Hamur',
    basePrice: 85.5,
    toppingPrice: 5,
  };

  const mockSuccessResponse = {
    statusCode: 201,
    body: {
      id: Math.random().toString(36).slice(2, 11),
      createdAt: new Date().toISOString(),
    },
  };

  const mockErrorResponse = {
    statusCode: 500,
    body: { error: 'Sunucu hatası' },
  };


  const goHome = () => cy.visit(BASE_URL);

  const clickOrderCTA = () => cy.contains(/^ACIKTIM$/).click();

  const getForm = () => cy.get('form').first();

  const nameInput = () => cy.get('input[name="name"]');

  const submitBtn = () => cy.get('button[type="submit"]').first();

  const totalPrice = () => cy.get('[data-testid="total-price"]');

  const selectSize = (labelText) => {

    cy.contains('label', labelText).click({ force: true });
  };

  const selectCrust = (labelText) => {
    cy.contains('label', labelText).click({ force: true });
  };

  const toppingsScope = () => {

    return cy.get('[data-testid="toppings"]').then(
      $el => ($el.length ? cy.wrap($el) : getForm())
    );
  };

  const toppings = () =>
    toppingsScope().find('input[type="checkbox"]:visible');

  const selectToppings = (count) => {
    toppings().should('have.length.greaterThan', 0);
    toppings().each(($cb, idx) => {
      if (idx < count) cy.wrap($cb).check({ force: true });
    });
  };

  const fillMandatoryFields = () => {
    nameInput().clear().type(testData.validName).blur();
    selectSize(testData.pizzaSize);
    selectCrust(testData.doughType);
  };

  beforeEach(() => {
    goHome();
    cy.viewport(1280, 720);
  });


  describe('Ana Sayfa Testleri', () => {
    it('Ana sayfa başlık ve slogan görüntülenmeli', () => {
      cy.get('h1').should('contain', 'Teknolojik Yemekler');
      cy.contains('KOD ACIKTIRIR PIZZA, DOYURUR').should('be.visible');
    });

    it('Sipariş butonu görünür ve aktif olmalı', () => {
      cy.contains(/^ACIKTIM$/)
        .should('be.visible')
        .and('not.be.disabled')
        .and('have.css', 'cursor', 'pointer');
    });

    it('Header bileşeni doğru render edilmeli', () => {
      cy.get('header').should('exist');
      cy.get('nav').should('be.visible');
      cy.get('img[alt*="logo" i]').should('be.visible');
    });
  });


  describe('Navigasyon Testleri', () => {
    it('Sipariş butonu form sayfasına yönlendirmeli', () => {
      clickOrderCTA();
      cy.url().should('include', '/pizza');
      cy.contains('Sipariş Oluştur').should('be.visible');
    });

    it('Geri butonu ana sayfaya yönlendirmeli', () => {
      clickOrderCTA();
      cy.contains('button', 'Geri').click();
      cy.url().should('eq', `${BASE_URL}/`);
    });
  });


  describe('Form Validasyon Testleri', () => {
    beforeEach(() => {
      clickOrderCTA();
    });

    describe('İsim Validasyonu', () => {
      it('İsim alanı minimum 3 karakter olmalı ve uyarı blur ile submite basmadan görünmeli', () => {
        nameInput().type(testData.shortName).blur();
        cy.contains('İsim en az 3 karakter olmalıdır')
          .should('be.visible')
          .and('have.class', 'error');
        submitBtn().should('be.disabled');
      });

      it('Geçerli isimde hata mesajı görünmemeli', () => {
        nameInput().type(testData.validName).blur();
        cy.contains('İsim en az 3 karakter olmalıdır').should('not.exist');
      });

      it('İsim alanı zorunlu olmalı', () => {
        nameInput().focus().blur();
        cy.contains('İsim gereklidir').should('be.visible');
      });
    });

    describe('Pizza Boyutu Validasyonu', () => {
      it('Pizza boyutu seçilmezse uyarı gösterilmeli ve submit disabled kalmalı', () => {
        nameInput().type(testData.validName).blur();
        selectCrust(testData.doughType);
        submitBtn().click({ force: true });
        cy.contains('Pizza boyutu seçilmelidir').should('be.visible');
        submitBtn().should('be.disabled');
      });

      it('Tüm boyut seçenekleri görünür olmalı', () => {
        ['Küçük', 'Orta', 'Büyük'].forEach(size => {
          cy.contains(size).should('be.visible');
        });
      });
    });

    describe('Hamur Kalınlığı Validasyonu', () => {
      it('Hamur seçilmezse uyarı gösterilmeli ve submit disabled kalmalı', () => {
        nameInput().type(testData.validName).blur();
        selectSize(testData.pizzaSize);
        submitBtn().click({ force: true });
        cy.contains('Hamur kalınlığı seçilmelidir').should('be.visible');
        submitBtn().should('be.disabled');
      });
    });

    describe('Malzeme Seçim Validasyonu', () => {
      it('Minimum 4 malzeme seçilmeli (uyarı submite basmadan görünmeli)', () => {
        fillMandatoryFields();
        selectToppings(3);
      
        cy.contains('En az 4 malzeme seçmelisiniz').should('be.visible');
        submitBtn().should('be.disabled');
      });

      it('Maksimum 10 malzeme seçilebilmeli (11. seçim engellenir)', () => {
        fillMandatoryFields();
        selectToppings(11);
        cy.contains('En fazla 10 malzeme seçebilirsiniz').should('be.visible');
        toppings().filter(':checked').should('have.length', 10);
      });

      it('4-10 arası seçimde hata olmamalı ve submit enable olmalı', () => {
        fillMandatoryFields();
        selectToppings(6);
        cy.contains('En az 4 malzeme seçmelisiniz').should('not.exist');
        cy.contains('En fazla 10 malzeme seçebilirsiniz').should('not.exist');
        submitBtn().should('not.be.disabled');
      });
    });
  });


  describe('Fiyat Hesaplama Testleri', () => {
    beforeEach(() => {
      clickOrderCTA();
      fillMandatoryFields();
    });

    it('Temel fiyat doğru gösterilmeli', () => {
      cy.contains(`${testData.basePrice} ₺`).should('be.visible');
    });

    it('Malzeme ekledikçe fiyat artmalı', () => {
      const toppingCount = 4;
      selectToppings(toppingCount);
      const expected = testData.basePrice + toppingCount * testData.toppingPrice;
      cy.contains(`${expected.toFixed(2)} ₺`).should('be.visible');
    });

    it('Malzeme çıkarılınca fiyat azalmalı', () => {
      selectToppings(5);
      toppings().filter(':checked').first().uncheck({ force: true });
      const expected = testData.basePrice + 4 * testData.toppingPrice;
      cy.contains(`${expected.toFixed(2)} ₺`).should('be.visible');
    });

    it('Boyut değişince fiyat güncellenmeli', () => {
      selectToppings(4);
      cy.contains('label', 'Büyük').click({ force: true });
      totalPrice()
        .invoke('text')
        .then((t) => {
          const price = parseFloat(t.replace(' ₺', '').replace(',', '.'));
          expect(price).to.be.greaterThan(testData.basePrice + 20);
        });
    });
  });


  describe('Sipariş Gönderim Testleri', () => {
    beforeEach(() => {
      clickOrderCTA();
      fillMandatoryFields();
      selectToppings(4);
    });

    it('Başarılı sipariş sonrası tebrik mesajı gösterilmeli', () => {
      cy.intercept('POST', '**/api/pizza', mockSuccessResponse).as('orderOk');
      submitBtn().click();
      cy.wait('@orderOk').its('response.statusCode').should('eq', 201);

      cy.contains('TEBRİKLER!').should('be.visible');
      cy.contains('SİPARİŞİNİZ ALINDI!').should('be.visible');
      cy.contains('Ana Sayfaya Dön').should('be.visible');
    });

    it('API 500 hatasında kullanıcı bilgilendirilmeli', () => {
      cy.intercept('POST', '**/api/pizza', mockErrorResponse).as('orderErr');
      submitBtn().click();
      cy.wait('@orderErr');


      cy.contains(/Sunucuya bağlanılamıyor|Lütfen daha sonra tekrar deneyiniz/i).should('be.visible');
      cy.get('[role="alert"]').should('exist');
    });

    it('Network hatası durumunda hata yönetimi çalışmalı', () => {
      cy.intercept('POST', '**/api/pizza', { forceNetworkError: true }).as('netErr');
      submitBtn().click();
      cy.wait('@netErr');
      cy.contains(/Network hatası oluştu|bağlanılamadı/i).should('be.visible');
    });

    it('Gönderim sırasında loading state ve buton disable olmalı', () => {
      cy.intercept('POST', '**/api/pizza', { delay: 1000, ...mockSuccessResponse }).as('delayed');
      submitBtn().click();
      submitBtn().should('be.disabled');
      cy.contains(/Sipariş Gönderiliyor/i).should('be.visible');
      cy.wait('@delayed');
    });
  });

 
  describe('Kullanıcı Deneyimi Testleri', () => {
    it('Form öğeleri focus durumunda doğru çalışmalı', () => {
      clickOrderCTA();
      nameInput().focus().should('have.focus');
      toppings().first().focus().should('have.focus');
    });

    it('Malzeme seçiminde görsel feedback olmalı (border rengi değişimi)', () => {
      clickOrderCTA();
      toppings().first().check({ force: true }).should('be.checked');
      toppings().first().parent().should('have.css', 'border-color');
    });

    it('Responsive tasarım (iPhone 6)', () => {
      cy.viewport('iphone-6');
      clickOrderCTA();
      getForm().should('be.visible');
      nameInput().should('be.visible');
      nameInput().invoke('outerWidth').should('be.lessThan', 400);
    });

    it('Form reset işlemi çalışmalı (geri dönünce sıfırlanır)', () => {
      clickOrderCTA();
      fillMandatoryFields();
      selectToppings(5);

      cy.contains('Geri').click();
      clickOrderCTA();

      nameInput().should('have.value', '');
      toppings().filter(':checked').should('have.length', 0);
    });
  });


  describe('Erişilebilirlik Testleri', () => {
    it('Form elementleri erişilebilir olmalı', () => {
      clickOrderCTA();
      nameInput().should('have.attr', 'aria-required', 'true');
      cy.get('fieldset').should('have.attr', 'aria-labelledby');
      submitBtn().should('have.attr', 'type', 'submit');
    });

    it('Hata mesajları screen reader için uygun olmalı', () => {
      clickOrderCTA();
      nameInput().focus().blur();
      cy.get('[role="alert"]').should('contain', 'İsim gereklidir');
    });

    it('Klavye navigasyonu çalışmalı', () => {
      clickOrderCTA();
      cy.get('body').type('{tab}');
      cy.focused().should('have.attr', 'name', 'name');
      cy.get('body').type('{tab}');
    });
  });

  afterEach(() => {
    cy.window().then((win) => win.sessionStorage && win.sessionStorage.clear());
  });
});
