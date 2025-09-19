describe('Teknolojik Yemekler Pizza Sipariş Testleri', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Ana sayfa elementleri yüklenmeli', () => {
    cy.contains('KOD AÇIKTIRIR PIZZA, DOYURUR').should('be.visible')
    cy.contains('ACIKTIN').should('be.visible').and('not.be.disabled')
  })

  it('Sipariş formuna yönlendirme çalışmalı', () => {
    cy.contains('ACIKTIN').click()
    cy.url().should('include', '/order')
    cy.contains('Sipariş Oluştur').should('be.visible')
  })

  it('İsim validasyonu çalışmalı', () => {
    cy.contains('ACIKTIN').click()
    
    cy.get('input[name="name"]').type('Ah')
    cy.get('input[name="name"]').blur()
    cy.contains('İsim en az 3 karakter olmalıdır').should('be.visible')
    
    cy.get('input[name="name"]').clear().type('Ahmet Yılmaz')
    cy.contains('İsim en az 3 karakter olmalıdır').should('not.exist')
  })

  it('Pizza boyut ve hamur seçimi zorunlu olmalı', () => {
    cy.contains('ACIKTIN').click()
    
    cy.get('input[name="name"]').type('Ahmet Yılmaz')
    
    cy.get('button[type="submit"]').click()
    
    cy.contains('Pizza boyutu seçilmelidir').should('be.visible')
    cy.contains('Hamur kalınlığı seçilmelidir').should('be.visible')
    cy.contains('En az 4 malzeme seçmelisiniz').should('be.visible')
  })

  it('Malzeme seçim sınırlaması çalışmalı', () => {
    cy.contains('ACIKTIN').click()
    
    for (let i = 0; i < 11; i++) {
      cy.get('input[type="checkbox"]').eq(i).check({ force: true })
    }
    
    cy.contains('En fazla 10 malzeme seçebilirsiniz').should('be.visible')
    
    cy.get('input[type="checkbox"]').first().uncheck()
    
    cy.contains('En fazla 10 malzeme seçebilirsiniz').should('not.exist')
  })

  it('Fiyat hesaplama doğru çalışmalı', () => {
    cy.contains('ACIKTIN').click()
    
    cy.get('input[name="name"]').type('Ahmet Yılmaz')
    
    cy.contains('Orta').click()
    
    cy.contains('Normal Hamur').click()
    
    for (let i = 0; i < 4; i++) {
      cy.get('input[type="checkbox"]').eq(i).check()
    }
    
    cy.contains('105.50 ₺').should('be.visible')
  })

  it('Başarılı sipariş gönderimi çalışmalı', () => {
    cy.contains('ACIKTIN').click()
    
    cy.get('input[name="name"]').type('Ahmet Yılmaz')
    cy.contains('Orta').click()
    cy.contains('Normal Hamur').click()
    
    for (let i = 0; i < 4; i++) {
      cy.get('input[type="checkbox"]').eq(i).check()
    }
    
    cy.intercept('POST', 'https://reqres.in/api/pizza', {
      statusCode: 201,
      body: {
        id: '12345',
        createdAt: new Date().toISOString()
      }
    }).as('pizzaOrder')
    
    cy.get('button[type="submit"]').click()
    
    cy.contains('TEBRİKLER!').should('be.visible')
    cy.contains('SİPARİŞİNİZ ALINDI!').should('be.visible')
  })

  it('API hatası durumunda hata gösterilmeli', () => {
    cy.contains('ACIKTIN').click()
    
    cy.get('input[name="name"]').type('Ahmet Yılmaz')
    cy.contains('Orta').click()
    cy.contains('Normal Hamur').click()
    
    for (let i = 0; i < 4; i++) {
      cy.get('input[type="checkbox"]').eq(i).check()
    }
    
    cy.intercept('POST', 'https://reqres.in/api/pizza', {
      statusCode: 500,
      body: { error: 'Sunucu hatası' }
    }).as('pizzaOrderError')
    
    cy.get('button[type="submit"]').click()
    
    cy.contains('Sunucuya bağlanılamıyor').should('be.visible')
  })
})